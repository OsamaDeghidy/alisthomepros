from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Proposal, ProposalMilestone, ProposalAttachment, ProposalView
from contracts.models import Contract

User = get_user_model()


class ContractBasicSerializer(serializers.ModelSerializer):
    """سيريالايزر أساسي للعقد"""
    
    class Meta:
        model = Contract
        fields = ['id', 'contract_number', 'title']


class UserBasicSerializer(serializers.ModelSerializer):
    """سيريالايزر أساسي للمستخدم"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    display_name = serializers.CharField(source='get_display_name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'display_name', 
            'email', 'user_type', 'avatar', 'is_verified', 'rating_average', 
            'rating_count', 'projects_completed', 'location'
        ]
        read_only_fields = fields


class ProposalMilestoneSerializer(serializers.ModelSerializer):
    """سيريالايزر للمعالم"""
    
    class Meta:
        model = ProposalMilestone
        fields = [
            'id', 'title', 'description', 'amount', 'timeline', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProposalAttachmentSerializer(serializers.ModelSerializer):
    """سيريالايزر للمرفقات"""
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    
    class Meta:
        model = ProposalAttachment
        fields = [
            'id', 'file', 'name', 'file_type', 'file_size', 'file_size_display',
            'description', 'created_at'
        ]
        read_only_fields = ['id', 'file_size', 'file_size_display', 'created_at']


class ProposalListSerializer(serializers.ModelSerializer):
    """سيريالايزر لقائمة العروض"""
    professional = UserBasicSerializer(read_only=True)
    contract = ContractBasicSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display_ar', read_only=True)
    response_time_display = serializers.CharField(source='get_response_time_display', read_only=True)
    milestones_count = serializers.SerializerMethodField()
    milestones_total = serializers.SerializerMethodField()
    views_count = serializers.SerializerMethodField()
    can_be_accepted = serializers.SerializerMethodField()
    can_be_rejected = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = [
            'id', 'professional', 'cover_letter', 'amount', 'currency', 'timeline', 'status',
            'status_display', 'priority', 'is_featured', 'response_time_display',
            'includes_materials', 'warranty_period', 'created_at', 'updated_at',
            'milestones_count', 'milestones_total', 'views_count',
            'can_be_accepted', 'can_be_rejected', 'professional_rating',
            'professional_reviews_count', 'professional_completion_rate', 'contract'
        ]
        read_only_fields = fields
    
    def get_milestones_count(self, obj):
        return obj.milestones.count()
    
    def get_milestones_total(self, obj):
        return sum(milestone.amount for milestone in obj.milestones.all())
    
    def get_views_count(self, obj):
        return obj.views.count()
    
    def get_can_be_accepted(self, obj):
        return obj.can_be_accepted()
    
    def get_can_be_rejected(self, obj):
        return obj.can_be_rejected()


class ProposalDetailSerializer(serializers.ModelSerializer):
    """سيريالايزر لتفاصيل العرض"""
    professional = UserBasicSerializer(read_only=True)
    contract = ContractBasicSerializer(read_only=True)
    milestones = ProposalMilestoneSerializer(many=True, read_only=True)
    attachments_files = ProposalAttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display_ar', read_only=True)
    response_time_display = serializers.CharField(source='get_response_time_display', read_only=True)
    views_count = serializers.SerializerMethodField()
    can_be_accepted = serializers.SerializerMethodField()
    can_be_rejected = serializers.SerializerMethodField()
    can_be_withdrawn = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = [
            'id', 'project', 'professional', 'cover_letter', 'amount', 'currency',
            'timeline', 'estimated_hours', 'status', 'status_display', 'priority',
            'is_featured', 'response_time', 'response_time_display', 'includes_materials',
            'warranty_period', 'portfolio_samples', 'attachments', 'client_response',
            'rejection_reason', 'created_at', 'updated_at', 'responded_at', 'expires_at',
            'professional_rating', 'professional_reviews_count', 'professional_completion_rate',
            'milestones', 'attachments_files', 'views_count', 'can_be_accepted',
            'can_be_rejected', 'can_be_withdrawn', 'contract'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'responded_at', 'professional',
            'status_display', 'response_time_display', 'views_count',
            'can_be_accepted', 'can_be_rejected', 'can_be_withdrawn'
        ]
    
    def get_views_count(self, obj):
        return obj.views.count()
    
    def get_can_be_accepted(self, obj):
        return obj.can_be_accepted()
    
    def get_can_be_rejected(self, obj):
        return obj.can_be_rejected()
    
    def get_can_be_withdrawn(self, obj):
        return obj.can_be_withdrawn()


class CreateProposalSerializer(serializers.ModelSerializer):
    """سيريالايزر لإنشاء عرض جديد"""
    milestones = ProposalMilestoneSerializer(many=True, required=False)
    
    class Meta:
        model = Proposal
        fields = [
            'project', 'cover_letter', 'amount', 'currency', 'timeline',
            'estimated_hours', 'priority', 'response_time', 'includes_materials',
            'warranty_period', 'portfolio_samples', 'attachments', 'milestones'
        ]
    
    def validate(self, data):
        """Validate proposal data"""
        # Check if user is professional
        user = self.context['request'].user
        if not user.is_professional():
            raise serializers.ValidationError("Only professionals can submit proposals")
        
        # Check if project accepts proposals
        project = data.get('project')
        if project and not project.can_receive_proposals():
            raise serializers.ValidationError("This project is not accepting new proposals")
        
        # Check for existing proposal
        if project and Proposal.objects.filter(project=project, professional=user).exists():
            raise serializers.ValidationError("You have already submitted a proposal for this project")
        
        return data
    
    def create(self, validated_data):
        """Create a new proposal"""
        milestones_data = validated_data.pop('milestones', [])
        
        # Add professional
        validated_data['professional'] = self.context['request'].user
        
        # Debug: Print cover letter
        print(f"📝 Creating proposal with cover letter: '{validated_data.get('cover_letter', 'NO COVER LETTER')}'")
        
        # Create proposal
        proposal = Proposal.objects.create(**validated_data)
        
        # Create milestones
        for milestone_data in milestones_data:
            ProposalMilestone.objects.create(proposal=proposal, **milestone_data)
        
        print(f"✅ Proposal created with ID: {proposal.id}, cover letter: '{proposal.cover_letter}'")
        return proposal


class UpdateProposalSerializer(serializers.ModelSerializer):
    """سيريالايزر لتحديث العرض"""
    
    class Meta:
        model = Proposal
        fields = [
            'cover_letter', 'amount', 'timeline', 'estimated_hours',
            'response_time', 'includes_materials', 'warranty_period',
            'portfolio_samples', 'attachments'
        ]
    
    def validate(self, data):
        """التحقق من إمكانية التحديث"""
        if self.instance.status != 'pending':
            raise serializers.ValidationError("لا يمكن تحديث العرض إلا إذا كان في حالة انتظار")
        
        return data


class AcceptProposalSerializer(serializers.Serializer):
    """سيريالايزر لقبول العرض"""
    message = serializers.CharField(required=False, max_length=500, help_text="رسالة للمحترف")


class RejectProposalSerializer(serializers.Serializer):
    """سيريالايزر لرفض العرض"""
    reason = serializers.CharField(max_length=255, help_text="سبب الرفض")
    message = serializers.CharField(required=False, max_length=500, help_text="رسالة للمحترف")


class ProposalStatsSerializer(serializers.Serializer):
    """سيريالايزر لإحصائيات العروض"""
    total_proposals = serializers.IntegerField()
    pending_proposals = serializers.IntegerField()
    accepted_proposals = serializers.IntegerField()
    rejected_proposals = serializers.IntegerField()
    avg_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_response_time = serializers.CharField()


class ProposalViewSerializer(serializers.ModelSerializer):
    """سيريالايزر لمشاهدات العروض"""
    viewer = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ProposalView
        fields = ['id', 'viewer', 'viewed_at', 'ip_address']
        read_only_fields = fields 