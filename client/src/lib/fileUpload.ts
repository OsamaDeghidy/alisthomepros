import api from './api';

export interface FileUploadData {
  file: File;
  upload_purpose?: 'profile_avatar' | 'project_image' | 'portfolio_item' | 'message_attachment' | 'contract_document' | 'proposal_attachment' | 'general';
  category?: number;
  description?: string;
  tags?: string[];
  is_public?: boolean;
  is_temp?: boolean;
  expires_at?: string;
}

export interface UploadedFile {
  id: number;
  file_id: string;
  file: string;
  original_filename: string;
  file_size: number;
  file_size_formatted: string;
  file_type: string;
  mime_type: string;
  file_extension: string;
  uploaded_by: any;
  upload_purpose: string;
  category: number;
  category_name: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  is_public: boolean;
  is_temp: boolean;
  expires_at?: string;
  download_count: number;
  last_accessed?: string;
  tags: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export const fileUploadService = {
  // Upload a single file
  async uploadFile(data: FileUploadData): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', data.file);
    
    if (data.upload_purpose) {
      formData.append('upload_purpose', data.upload_purpose);
    }
    
    if (data.category) {
      formData.append('category', data.category.toString());
    }
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    
    if (data.is_public !== undefined) {
      formData.append('is_public', data.is_public.toString());
    }
    
    if (data.is_temp !== undefined) {
      formData.append('is_temp', data.is_temp.toString());
    }
    
    if (data.expires_at) {
      formData.append('expires_at', data.expires_at);
    }

    const response = await api.post('/files/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  async uploadMultipleFiles(files: FileUploadData[]): Promise<UploadedFile[]> {
    const uploadPromises = files.map(fileData => this.uploadFile(fileData));
    return Promise.all(uploadPromises);
  },

  // Get file categories
  async getFileCategories(): Promise<any[]> {
    const response = await api.get('/files/categories/');
    return response.data;
  },

  // Get user's uploaded files
  async getUserFiles(params?: {
    file_type?: string;
    upload_purpose?: string;
    is_public?: boolean;
    category?: number;
    search?: string;
    ordering?: string;
  }): Promise<UploadedFile[]> {
    const response = await api.get('/files/files/', { params });
    return response.data.results || response.data;
  },

  // Get file details
  async getFileDetails(fileId: string): Promise<UploadedFile> {
    const response = await api.get(`/files/files/${fileId}/`);
    return response.data;
  },

  // Download file
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await api.get(`/files/files/${fileId}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    await api.delete(`/files/files/${fileId}/`);
  },

  // Delete multiple files
  async deleteMultipleFiles(fileIds: string[]): Promise<void> {
    await api.post('/files/files/delete-multiple/', {
      file_ids: fileIds,
    });
  },
};