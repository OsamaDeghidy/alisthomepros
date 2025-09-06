from rest_framework import permissions


class IsProposalOwnerOrProjectOwner(permissions.BasePermission):
    """الصلاحية لصاحب العرض أو صاحب المشروع"""
    
    def has_object_permission(self, request, view, obj):
        # للقراءة: صاحب العرض أو صاحب المشروع أو الإدارة
        if request.method in permissions.SAFE_METHODS:
            return (
                obj.professional == request.user or
                obj.project.client == request.user or
                request.user.is_staff
            )
        
        # للتعديل: صاحب العرض فقط (إذا كان في حالة انتظار)
        if request.method in ['PUT', 'PATCH']:
            return (
                obj.professional == request.user and
                obj.status == 'pending'
            )
        
        # للحذف: صاحب العرض أو الإدارة
        if request.method == 'DELETE':
            return (
                obj.professional == request.user or
                request.user.is_staff
            )
        
        return False


class IsProjectOwner(permissions.BasePermission):
    """الصلاحية لصاحب المشروع فقط"""
    
    def has_object_permission(self, request, view, obj):
        return obj.project.client == request.user or request.user.is_staff


class IsProfessional(permissions.BasePermission):
    """الصلاحية للمحترفين فقط"""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_professional()
        )


class IsClient(permissions.BasePermission):
    """الصلاحية للعملاء فقط"""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type == 'client'
        ) 