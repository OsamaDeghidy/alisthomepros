from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from .models import (
    FileCategory, UploadedFile, FileShare, FileVersion, 
    FileComment, FileFolder, FileSettings
)

User = get_user_model()


class FileCategoryModelTest(TestCase):
    def test_file_category_creation(self):
        """Test creating a file category"""
        category = FileCategory.objects.create(
            name='Images',
            description='Image files',
            allowed_extensions=['.jpg', '.png', '.gif'],
            max_file_size=5242880  # 5MB
        )
        
        self.assertEqual(category.name, 'Images')
        self.assertEqual(category.max_file_size, 5242880)
        self.assertTrue(category.is_active)
        self.assertIn('.jpg', category.allowed_extensions)


class UploadedFileModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.category = FileCategory.objects.create(
            name='Documents',
            description='Document files'
        )
    
    def test_uploaded_file_creation(self):
        """Test creating an uploaded file"""
        # Create a simple test file
        test_file = SimpleUploadedFile(
            "test.txt",
            b"file_content",
            content_type="text/plain"
        )
        
        uploaded_file = UploadedFile.objects.create(
            file=test_file,
            original_filename='test.txt',
            file_size=12,
            file_type='document',
            mime_type='text/plain',
            uploaded_by=self.user,
            upload_purpose='general',
            category=self.category
        )
        
        self.assertEqual(uploaded_file.original_filename, 'test.txt')
        self.assertEqual(uploaded_file.file_size, 12)
        self.assertEqual(uploaded_file.file_type, 'document')
        self.assertEqual(uploaded_file.uploaded_by, self.user)
        self.assertEqual(uploaded_file.category, self.category)
    
    def test_file_size_formatted(self):
        """Test file size formatting"""
        uploaded_file = UploadedFile.objects.create(
            original_filename='test.txt',
            file_size=1024,  # 1KB
            file_type='document',
            uploaded_by=self.user
        )
        
        self.assertEqual(uploaded_file.file_size_formatted, '1.0 KB')
    
    def test_file_extension(self):
        """Test file extension property"""
        uploaded_file = UploadedFile.objects.create(
            original_filename='test.pdf',
            file_size=1024,
            file_type='document',
            uploaded_by=self.user
        )
        
        self.assertEqual(uploaded_file.file_extension, '.pdf')
    
    def test_is_image_method(self):
        """Test is_image method"""
        image_file = UploadedFile.objects.create(
            original_filename='image.jpg',
            file_size=1024,
            file_type='image',
            uploaded_by=self.user
        )
        
        doc_file = UploadedFile.objects.create(
            original_filename='doc.pdf',
            file_size=1024,
            file_type='document',
            uploaded_by=self.user
        )
        
        self.assertTrue(image_file.is_image())
        self.assertFalse(doc_file.is_image())


class FileShareModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.owner = User.objects.create_user(
            username='owner',
            email='owner@example.com',
            password='testpass123'
        )
        
        self.recipient = User.objects.create_user(
            username='recipient',
            email='recipient@example.com',
            password='testpass123'
        )
        
        self.file = UploadedFile.objects.create(
            original_filename='shared.txt',
            file_size=1024,
            file_type='document',
            uploaded_by=self.owner
        )
    
    def test_file_share_creation(self):
        """Test creating a file share"""
        share = FileShare.objects.create(
            file=self.file,
            shared_with=self.recipient,
            shared_by=self.owner,
            permission='view',
            max_access_count=10
        )
        
        self.assertEqual(share.file, self.file)
        self.assertEqual(share.shared_with, self.recipient)
        self.assertEqual(share.shared_by, self.owner)
        self.assertEqual(share.permission, 'view')
        self.assertEqual(share.max_access_count, 10)
        self.assertEqual(share.access_count, 0)
    
    def test_can_access_method(self):
        """Test can_access method"""
        # Create share without limits
        share = FileShare.objects.create(
            file=self.file,
            shared_with=self.recipient,
            shared_by=self.owner,
            permission='view'
        )
        
        self.assertTrue(share.can_access())
        
        # Create share with access limit reached
        limited_share = FileShare.objects.create(
            file=self.file,
            shared_with=self.recipient,
            shared_by=self.owner,
            permission='view',
            max_access_count=1,
            access_count=1
        )
        
        self.assertFalse(limited_share.can_access())
    
    def test_record_access_method(self):
        """Test record_access method"""
        share = FileShare.objects.create(
            file=self.file,
            shared_with=self.recipient,
            shared_by=self.owner,
            permission='view',
            max_access_count=5
        )
        
        # Record access
        result = share.record_access()
        self.assertTrue(result)
        
        share.refresh_from_db()
        self.assertEqual(share.access_count, 1)
        self.assertIsNotNone(share.last_accessed)


class FileFolderModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_folder_creation(self):
        """Test creating a file folder"""
        folder = FileFolder.objects.create(
            name='Documents',
            description='My documents folder',
            owner=self.user
        )
        
        self.assertEqual(folder.name, 'Documents')
        self.assertEqual(folder.owner, self.user)
        self.assertIsNone(folder.parent)
        self.assertFalse(folder.is_public)
    
    def test_subfolder_creation(self):
        """Test creating a subfolder"""
        parent_folder = FileFolder.objects.create(
            name='Projects',
            owner=self.user
        )
        
        subfolder = FileFolder.objects.create(
            name='Project1',
            parent=parent_folder,
            owner=self.user
        )
        
        self.assertEqual(subfolder.parent, parent_folder)
        self.assertIn(subfolder, parent_folder.subfolders.all())
    
    def test_get_full_path(self):
        """Test get_full_path method"""
        parent = FileFolder.objects.create(
            name='Documents',
            owner=self.user
        )
        
        child = FileFolder.objects.create(
            name='Work',
            parent=parent,
            owner=self.user
        )
        
        grandchild = FileFolder.objects.create(
            name='Reports',
            parent=child,
            owner=self.user
        )
        
        self.assertEqual(parent.get_full_path(), 'Documents')
        self.assertEqual(child.get_full_path(), 'Documents/Work')
        self.assertEqual(grandchild.get_full_path(), 'Documents/Work/Reports')


class FileSettingsModelTest(TestCase):
    def test_file_settings_creation(self):
        """Test creating file settings"""
        settings = FileSettings.objects.create(
            max_file_size_general=10485760,  # 10MB
            storage_limit_client=1073741824,  # 1GB
            enable_virus_scanning=True
        )
        
        self.assertEqual(settings.max_file_size_general, 10485760)
        self.assertEqual(settings.storage_limit_client, 1073741824)
        self.assertTrue(settings.enable_virus_scanning)
        self.assertTrue(settings.is_active)
    
    def test_default_extensions_on_save(self):
        """Test that default extensions are set on save"""
        settings = FileSettings.objects.create()
        
        self.assertIn('.jpg', settings.allowed_image_extensions)
        self.assertIn('.pdf', settings.allowed_document_extensions)
        self.assertIn('.mp4', settings.allowed_video_extensions) 