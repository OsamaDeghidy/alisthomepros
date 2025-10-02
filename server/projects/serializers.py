from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from .models import Project, Category, ProjectImage, ProjectFile, ProjectFavorite, ProjectView, ProjectUpdate, IntakeLead
from file_management.models import UploadedFile
from payments.models import Payment, WalletTransaction
import os
import shutil

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer لتصنيفات المشاريع"""
    projects_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 
            'is_active', 'order', 'projects_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_projects_count(self, obj):
        """Get count of active projects in this category"""
        return obj.projects.filter(status__in=['published', 'in_progress']).count()


class ProjectImageSerializer(serializers.ModelSerializer):
    """Serializer لصور المشاريع"""
    
    class Meta:
        model = ProjectImage
        fields = [
            'id', 'project', 'image', 'caption', 
            'is_primary', 'order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ProjectFileSerializer(serializers.ModelSerializer):
    """Serializer لملفات المشاريع"""
    file_size_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectFile
        fields = [
            'id', 'project', 'file', 'filename', 'file_type', 
            'file_size', 'file_size_display', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'filename', 'file_size', 'created_at']
    
    def get_file_size_display(self, obj):
        return obj.get_file_size_display()
    
    def create(self, validated_data):
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['filename'] = file_obj.name
            validated_data['file_size'] = file_obj.size
            # Detect file type based on extension
            filename = file_obj.name.lower()
            if filename.endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp')):
                validated_data['file_type'] = 'image'
            elif filename.endswith(('.mp4', '.avi', '.mov', '.wmv', '.flv')):
                validated_data['file_type'] = 'video'
            elif filename.endswith(('.mp3', '.wav', '.flac', '.aac')):
                validated_data['file_type'] = 'audio'
            elif filename.endswith(('.pdf', '.doc', '.docx', '.txt', '.rtf')):
                validated_data['file_type'] = 'document'
            else:
                validated_data['file_type'] = 'other'
        
        return super().create(validated_data)


class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer أساسي لبيانات المستخدم"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'avatar', 'rating_average', 'rating_count', 
            'projects_completed', 'is_verified'
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer لقائمة المشاريع"""
    client = UserBasicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    budget_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'client', 'category',
            'location', 'budget_display', 'timeline', 'status', 'urgency',
            'required_skills', 'required_roles', 'is_featured', 'is_remote_allowed',
            'requires_license', 'requires_insurance', 'is_paid', 'views_count', 
            'favorites_count', 'proposals_count', 'assigned_professional',
            'completion_percentage', 'published_at', 'created_at'
        ]
    
    def get_budget_display(self, obj):
        return obj.get_budget_display()


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Serializer تفصيلي للمشاريع"""
    client = UserBasicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    assigned_professional = UserBasicSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)
    budget_display = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'client', 'category',
            'location', 'budget_type', 'budget_min', 'budget_max', 
            'budget_display', 'timeline', 'start_date', 'end_date',
            'required_skills', 'required_roles', 'additional_requirements', 'status', 'urgency',
            'is_featured', 'is_remote_allowed', 'requires_license', 
            'requires_insurance', 'is_paid', 'views_count', 'favorites_count', 
            'proposals_count', 'assigned_professional', 'completion_percentage',
            'published_at', 'created_at', 'updated_at', 'images', 'files',
            'is_favorited'
        ]
    
    def get_budget_display(self, obj):
        return obj.get_budget_display()
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProjectFavorite.objects.filter(
                user=request.user, 
                project=obj
            ).exists()
        return False


class ProjectCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء المشاريع"""
    image_ids = serializers.ListField(
        child=serializers.IntegerField(allow_null=False),
        required=False,
        allow_empty=True,
        write_only=True,
        help_text="List of uploaded file IDs to associate with this project"
    )
    payment_option = serializers.ChoiceField(
        choices=[('pay', 'Pay Now'), ('no-pay', 'Post Without Payment')],
        required=True,
        write_only=True,
        help_text="Payment option selected by the client"
    )
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category', 'location', 
            'budget_type', 'budget_min', 'budget_max',
            'timeline', 'start_date', 'end_date', 'required_skills',
            'required_roles', 'additional_requirements', 'urgency', 'is_remote_allowed',
            'requires_license', 'requires_insurance', 'image_ids', 'payment_option', 'status'
        ]
    
    def validate(self, attrs):
        # Validate budget fields
        budget_type = attrs.get('budget_type')
        budget_min = attrs.get('budget_min')
        budget_max = attrs.get('budget_max')
        
        if budget_type == 'fixed' and not budget_min:
            raise serializers.ValidationError("Fixed budget requires minimum budget")
        
        if budget_min and budget_max and budget_min > budget_max:
            raise serializers.ValidationError("Minimum budget cannot be greater than maximum budget")
        
        return attrs
    
    def create(self, validated_data):
        from payments.models import Wallet, WalletTransaction, Payment, EscrowAccount
        from contracts.models import Contract
        from decimal import Decimal
        from django.db import transaction
        from django.utils import timezone
        from datetime import timedelta
        
        # Extract fields before creating project
        image_ids = validated_data.pop('image_ids', [])
        payment_option = validated_data.pop('payment_option')
        
        # Set client from request user
        client = self.context['request'].user
        validated_data['client'] = client
        
        # Set default status to in_progress
        if 'status' not in validated_data:
            validated_data['status'] = 'in_progress'
        
        # Calculate and set budget_display
        if validated_data.get('budget_type') == 'fixed':
            budget_display = f"${validated_data.get('budget_min', 0):,.2f}"
        elif validated_data.get('budget_type') == 'hourly':
            budget_display = f"${validated_data.get('budget_min', 0):,.2f}/hr"
        else:  # range
            budget_min = validated_data.get('budget_min', 0)
            budget_max = validated_data.get('budget_max', 0)
            budget_display = f"${budget_min:,.2f} - ${budget_max:,.2f}"
        
        validated_data['budget_display'] = budget_display
        
        # Handle payment processing
        with transaction.atomic():
            # Create the project
            project = super().create(validated_data)
            
            # Process payment if required
            if payment_option == 'pay':
                project_cost = validated_data.get('budget_min', 0)
                if project_cost and project_cost > 0:
                    try:
                        # Get or create wallet
                        wallet, created = Wallet.objects.get_or_create(
                            user=client,
                            defaults={'available_balance': Decimal('0.00')}
                        )
                        
                        # Check if wallet has sufficient balance
                        if wallet.available_balance < Decimal(str(project_cost)):
                            raise serializers.ValidationError(
                                "Insufficient wallet balance. Please top up your wallet."
                            )
                        
                        # Move funds to pending balance
                        success = wallet.move_to_pending(Decimal(str(project_cost)))
                        if not success:
                            raise serializers.ValidationError(
                                "Failed to move funds to pending balance."
                            )
                        
                        # Create temporary contract (client is both client and professional initially)
                        temp_contract = Contract.objects.create(
                            title=f"Temporary Contract for {project.title}",
                            description=f"Temporary contract created for project: {project.title}",
                            client=client,
                            professional=client,  # Temporary - will be updated when proposal is accepted
                            project=project,
                            total_amount=Decimal(str(project_cost)),
                            contract_balance=Decimal(str(project_cost)),
                            payment_type='fixed',
                            start_date=timezone.now().date(),
                            end_date=timezone.now().date() + timedelta(days=30),  # Default 30 days
                            status='draft'  # Temporary status
                        )
                        
                        # Create escrow account linked to temporary contract
                        escrow = EscrowAccount.objects.create(
                            client=client,
                            professional=client,  # Temporary - will be updated when proposal is accepted
                            contract=temp_contract,
                            amount=Decimal(str(project_cost)),
                            platform_fee_rate=Decimal('0.10'),  # 10% platform fee
                            platform_fee_amount=Decimal(str(project_cost)) * Decimal('0.10'),
                            processing_fee_rate=Decimal('0.029'),  # 2.9% processing fee
                            processing_fee_fixed=Decimal('0.30'),  # $0.30 fixed fee
                            net_amount=Decimal(str(project_cost)) - (Decimal(str(project_cost)) * Decimal('0.10')) - (Decimal(str(project_cost)) * Decimal('0.029')) - Decimal('0.30'),
                            status='funded',
                            funded_at=timezone.now(),
                            auto_release_date=timezone.now() + timedelta(days=7),  # Auto-release after 7 days
                            terms_accepted=True,
                            description=f"Escrow for project: {project.title}"
                        )
                        
                        # Calculate processing fee amount
                        processing_fee_amount = (Decimal(str(project_cost)) * escrow.processing_fee_rate) + escrow.processing_fee_fixed
                        escrow.processing_fee_amount = processing_fee_amount
                        escrow.save()
                        
                        # Create transaction record
                        WalletTransaction.objects.create(
                            wallet=wallet,
                            amount=Decimal(str(project_cost)),
                            transaction_type='debit',
                            source='project_payment',
                            description=f"Payment for project: {project.title} (moved to escrow)",
                            escrow=escrow
                        )
                        
                        # Create payment record linked to escrow
                        Payment.objects.create(
                            payer=client,
                            payee=client,  # For project payments, client is both payer and payee initially
                            amount=Decimal(str(project_cost)),
                            payment_type='project_payment',
                            status='succeeded',
                            description=f"Payment for project: {project.title}",
                            contract=temp_contract,
                            escrow=escrow,
                            gross_amount=Decimal(str(project_cost)),
                            platform_fee=escrow.platform_fee_amount,
                            processing_fee=processing_fee_amount,
                            net_amount=escrow.net_amount
                        )
                        
                        # Update project to indicate it's paid
                        project.is_paid = True
                        project.save()
                        
                    except Exception as e:
                        raise serializers.ValidationError(f"Payment processing failed: {str(e)}")
            
            # Associate uploaded files with the project
            if image_ids:
                # Get uploaded files that belong to the current user
                uploaded_files = UploadedFile.objects.filter(
                    id__in=image_ids,
                    uploaded_by=client,
                    upload_purpose='project_image'
                )
                
                # Create ProjectImage instances
                for i, uploaded_file in enumerate(uploaded_files):
                    # Copy file content to create a new file in projects folder
                    if uploaded_file.file and os.path.exists(uploaded_file.file.path):
                        # Read the original file content
                        with open(uploaded_file.file.path, 'rb') as original_file:
                            file_content = original_file.read()
                        
                        # Create new file with original filename
                        original_filename = uploaded_file.original_filename or os.path.basename(uploaded_file.file.name)
                        
                        # Create ProjectImage instance with new file
                        project_image = ProjectImage(
                            project=project,
                            caption=uploaded_file.description or '',
                            is_primary=(i == 0),  # First image is primary
                            order=i
                        )
                        
                        # Save the file content to the image field
                        project_image.image.save(
                            original_filename,
                            ContentFile(file_content),
                            save=False
                        )
                        
                        # Save the ProjectImage instance
                        project_image.save()
        
        return project


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Serializer لتحديث المشاريع"""
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category', 'location', 
            'budget_type', 'budget_min', 'budget_max', 'budget_display',
            'timeline', 'start_date', 'end_date', 'required_skills',
            'required_roles', 'urgency', 'is_remote_allowed',
            'requires_license', 'requires_insurance', 'status'
        ]
    
    def validate_status(self, value):
        """Validate status transitions"""
        if self.instance:
            current_status = self.instance.status
            # Only allow certain status transitions
            allowed_transitions = {
                'draft': ['published', 'cancelled'],
                'published': ['in_progress', 'cancelled'],
                'in_progress': ['completed', 'paused', 'cancelled'],
                'paused': ['in_progress', 'cancelled'],
                'completed': [],  # No transitions from completed
                'cancelled': []   # No transitions from cancelled
            }
            
            if value not in allowed_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot change status from {current_status} to {value}"
                )
        
        return value
    
    def update(self, instance, validated_data):
        """Handle project updates including cancellation refunds"""
        from payments.models import Wallet, WalletTransaction, EscrowAccount
        from contracts.models import Contract
        from decimal import Decimal
        from django.db import transaction
        
        new_status = validated_data.get('status')
        old_status = instance.status
        
        # Handle project cancellation refund
        if new_status == 'cancelled' and old_status != 'cancelled' and instance.is_paid:
            with transaction.atomic():
                try:
                    # Find the temporary contract and escrow for this project
                    temp_contracts = Contract.objects.filter(
                        project=instance,
                        client=instance.client,
                        professional=instance.client,  # Temporary contracts have client as professional
                        status='draft'
                    )
                    
                    if temp_contracts.exists():
                        temp_contract = temp_contracts.first()
                        
                        # Find associated escrow account
                        escrow_accounts = EscrowAccount.objects.filter(
                            contract=temp_contract,
                            client=instance.client,
                            status='funded'
                        )
                        
                        if escrow_accounts.exists():
                            escrow = escrow_accounts.first()
                            
                            # Get client's wallet
                            wallet, created = Wallet.objects.get_or_create(
                                user=instance.client,
                                defaults={'available_balance': Decimal('0.00')}
                            )
                            
                            # Move funds from pending back to available balance
                            refund_amount = escrow.amount
                            if wallet.pending_balance >= refund_amount:
                                wallet.pending_balance -= refund_amount
                                wallet.available_balance += refund_amount
                                wallet.save()
                                
                                # Create wallet transaction record
                                WalletTransaction.objects.create(
                                    wallet=wallet,
                                    amount=refund_amount,
                                    transaction_type='credit',
                                    source='project_cancellation_refund',
                                    description=f"Refund for cancelled project: {instance.title}"
                                )
                                
                                # Update escrow status
                                escrow.status = 'refunded'
                                escrow.save()
                                
                                # Update payment records
                                escrow.payments.update(status='refunded')
                                
                                # Delete temporary contract
                                temp_contract.delete()
                                
                                # Update project payment status
                                instance.is_paid = False
                                
                                print(f"✅ Refunded ${refund_amount} to client {instance.client.username} for cancelled project {instance.title}")
                            else:
                                print(f"❌ Insufficient pending balance for refund. Required: ${refund_amount}, Available: ${wallet.pending_balance}")
                        else:
                            print(f"❌ No funded escrow account found for project {instance.title}")
                    else:
                        print(f"❌ No temporary contract found for project {instance.title}")
                        
                except Exception as e:
                    print(f"❌ Error processing refund for project {instance.title}: {str(e)}")
                    raise serializers.ValidationError(f"Failed to process refund: {str(e)}")
        
        # Update the instance with validated data
        return super().update(instance, validated_data)


class ProjectFavoriteSerializer(serializers.ModelSerializer):
    """Serializer لمفضلة المشاريع"""
    project = ProjectListSerializer(read_only=True)
    
    class Meta:
        model = ProjectFavorite
        fields = ['id', 'project', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProjectUpdateHistorySerializer(serializers.ModelSerializer):
    """Serializer لتاريخ تحديثات المشاريع"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ProjectUpdate
        fields = [
            'id', 'project', 'user', 'update_type', 'title', 
            'description', 'previous_status', 'new_status',
            'previous_completion', 'new_completion', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ProjectStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات المشاريع"""
    total_projects = serializers.IntegerField()
    published_projects = serializers.IntegerField()
    in_progress_projects = serializers.IntegerField()
    completed_projects = serializers.IntegerField()
    cancelled_projects = serializers.IntegerField()
    total_budget = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_budget = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_views = serializers.IntegerField()
    total_favorites = serializers.IntegerField()
    total_proposals = serializers.IntegerField()


class ProjectSearchSerializer(serializers.Serializer):
    """Serializer للبحث في المشاريع"""
    query = serializers.CharField(required=False)
    category = serializers.CharField(required=False)
    location = serializers.CharField(required=False)
    budget_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    budget_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    status = serializers.CharField(required=False)
    urgency = serializers.CharField(required=False)
    is_remote_allowed = serializers.BooleanField(required=False)
    requires_license = serializers.BooleanField(required=False)
    requires_insurance = serializers.BooleanField(required=False)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    roles = serializers.ListField(child=serializers.CharField(), required=False)
    ordering = serializers.CharField(required=False)


class IntakeLeadSerializer(serializers.ModelSerializer):
    """Serializer لنموذج استقبال بيانات نموذج المشروع العام"""
    class Meta:
        model = IntakeLead
        fields = [
            'id', 'full_name', 'email', 'phone', 'message',
            'source_path', 'language', 'consent', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_phone(self, value):
        # تحقق مبسط من رقم الهاتف
        digits = ''.join(ch for ch in value if ch.isdigit())
        if len(digits) < 7:
            raise serializers.ValidationError('Please enter a valid phone number')
        return value

    def create(self, validated_data):
        # الحالة الافتراضية new
        validated_data.setdefault('status', 'new')
        return super().create(validated_data)