from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Dispute, DisputeMessage, DisputeEvidence, DisputeResolution
from contracts.models import Contract, ContractMilestone
from payments.models import Payment

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """معلومات أساسية للمستخدم"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name', 'email', 'avatar']


class DisputeEvidenceSerializer(serializers.ModelSerializer):
    """سيريالايزر أدلة النزاع"""
    uploaded_by = UserBasicSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DisputeEvidence
        fields = [
            'id', 'title', 'description', 'evidence_type', 'file_path',
            'file_url', 'file_size', 'uploaded_by', 'created_at'
        ]
    
    def get_file_url(self, obj):
        if obj.file_path:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file_path.url)
        return obj.file_url


class DisputeEvidenceCreateSerializer(serializers.ModelSerializer):
    """سيريالايزر إنشاء أدلة النزاع"""
    
    class Meta:
        model = DisputeEvidence
        fields = [
            'title', 'description', 'evidence_type', 'file_path', 'file_url'
        ]


class DisputeMessageSerializer(serializers.ModelSerializer):
    """سيريالايزر رسائل النزاع"""
    sender = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = DisputeMessage
        fields = [
            'id', 'message_type', 'content', 'attachments', 'sender',
            'is_internal', 'is_system_message', 'created_at', 'updated_at'
        ]


class DisputeMessageCreateSerializer(serializers.ModelSerializer):
    """سيريالايزر إنشاء رسائل النزاع"""
    
    class Meta:
        model = DisputeMessage
        fields = ['message_type', 'content', 'attachments', 'is_internal']


class DisputeResolutionSerializer(serializers.ModelSerializer):
    """سيريالايزر قرارات حل النزاعات"""
    resolved_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = DisputeResolution
        fields = [
            'id', 'resolution_type', 'resolution_summary', 'resolution_details',
            'refund_amount', 'penalty_amount', 'resolved_by', 'resolved_at',
            'is_implemented', 'implementation_date', 'implementation_notes'
        ]


class DisputeResolutionCreateSerializer(serializers.ModelSerializer):
    """سيريالايزر إنشاء قرارات حل النزاعات"""
    
    class Meta:
        model = DisputeResolution
        fields = [
            'resolution_type', 'resolution_summary', 'resolution_details',
            'refund_amount', 'penalty_amount', 'implementation_notes'
        ]


class ContractBasicSerializer(serializers.ModelSerializer):
    """معلومات أساسية للعقد"""
    client = UserBasicSerializer(read_only=True)
    professional = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'title', 'total_amount', 'status',
            'client', 'professional', 'created_at'
        ]


class MilestoneBasicSerializer(serializers.ModelSerializer):
    """معلومات أساسية للمرحلة"""
    
    class Meta:
        model = ContractMilestone
        fields = ['id', 'title', 'amount', 'status', 'due_date']


class PaymentBasicSerializer(serializers.ModelSerializer):
    """معلومات أساسية للدفعة"""
    
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'status', 'created_at']


class DisputeListSerializer(serializers.ModelSerializer):
    """سيريالايزر قائمة النزاعات"""
    raised_by = UserBasicSerializer(read_only=True)
    against = UserBasicSerializer(read_only=True)
    assigned_to = UserBasicSerializer(read_only=True)
    contract = ContractBasicSerializer(read_only=True)
    milestone = MilestoneBasicSerializer(read_only=True)
    payment = PaymentBasicSerializer(read_only=True)
    messages_count = serializers.SerializerMethodField()
    evidence_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Dispute
        fields = [
            'id', 'dispute_id', 'title', 'dispute_type', 'status', 'priority',
            'raised_by', 'against', 'assigned_to', 'contract', 'milestone', 'payment',
            'disputed_amount', 'created_at', 'updated_at', 'due_date',
            'messages_count', 'evidence_count'
        ]
    
    def get_messages_count(self, obj):
        return obj.messages.count()
    
    def get_evidence_count(self, obj):
        return obj.evidence.count()


class DisputeDetailSerializer(serializers.ModelSerializer):
    """سيريالايزر تفاصيل النزاع"""
    raised_by = UserBasicSerializer(read_only=True)
    against = UserBasicSerializer(read_only=True)
    assigned_to = UserBasicSerializer(read_only=True)
    resolved_by = UserBasicSerializer(read_only=True)
    contract = ContractBasicSerializer(read_only=True)
    milestone = MilestoneBasicSerializer(read_only=True)
    payment = PaymentBasicSerializer(read_only=True)
    messages = DisputeMessageSerializer(many=True, read_only=True)
    evidence = DisputeEvidenceSerializer(many=True, read_only=True)
    resolution = DisputeResolutionSerializer(read_only=True)
    
    class Meta:
        model = Dispute
        fields = [
            'id', 'dispute_id', 'title', 'description', 'dispute_type', 'status',
            'priority', 'raised_by', 'against', 'assigned_to', 'resolved_by',
            'contract', 'milestone', 'payment', 'disputed_amount', 'refund_amount',
            'resolution_notes', 'resolution_date', 'created_at', 'updated_at',
            'due_date', 'evidence_files', 'metadata', 'messages', 'evidence', 'resolution'
        ]


class DisputeCreateSerializer(serializers.ModelSerializer):
    """سيريالايزر إنشاء النزاع"""
    
    class Meta:
        model = Dispute
        fields = [
            'title', 'description', 'dispute_type', 'priority', 'against',
            'contract', 'milestone', 'payment', 'disputed_amount', 'evidence_files'
        ]
    
    def validate(self, data):
        # التحقق من وجود علاقة واحدة على الأقل (عقد أو مرحلة أو دفعة)
        if not any([data.get('contract'), data.get('milestone'), data.get('payment')]):
            raise serializers.ValidationError(
                "يجب ربط النزاع بعقد أو مرحلة أو دفعة على الأقل"
            )
        
        # التحقق من صحة العلاقات
        user = self.context['request'].user
        against_user = data.get('against')
        
        if user == against_user:
            raise serializers.ValidationError(
                "لا يمكن فتح نزاع ضد نفسك"
            )
        
        # التحقق من صحة العقد إذا تم تحديده
        contract = data.get('contract')
        if contract:
            if user not in [contract.client, contract.professional]:
                raise serializers.ValidationError(
                    "يمكنك فقط فتح نزاع على العقود التي تشارك فيها"
                )
            if against_user not in [contract.client, contract.professional]:
                raise serializers.ValidationError(
                    "الطرف المقابل يجب أن يكون جزءاً من العقد"
                )
        
        return data


class DisputeUpdateSerializer(serializers.ModelSerializer):
    """سيريالايزر تحديث النزاع"""
    
    class Meta:
        model = Dispute
        fields = [
            'status', 'priority', 'assigned_to', 'resolution_notes',
            'refund_amount', 'due_date', 'metadata'
        ]
    
    def validate_status(self, value):
        user = self.context['request'].user
        dispute = self.instance
        
        # فقط الأطراف المعنية أو الإدارة يمكنهم تغيير الحالة
        if not (user in [dispute.raised_by, dispute.against] or user.is_staff):
            raise serializers.ValidationError(
                "ليس لديك صلاحية لتغيير حالة هذا النزاع"
            )
        
        # بعض الحالات يمكن تغييرها فقط من قبل الإدارة
        admin_only_statuses = ['resolved', 'escalated', 'closed']
        if value in admin_only_statuses and not user.is_staff:
            raise serializers.ValidationError(
                f"فقط الإدارة يمكنها تغيير الحالة إلى {value}"
            )
        
        return value


class DisputeStatsSerializer(serializers.Serializer):
    """سيريالايزر إحصائيات النزاعات"""
    total_disputes = serializers.IntegerField()
    open_disputes = serializers.IntegerField()
    resolved_disputes = serializers.IntegerField()
    escalated_disputes = serializers.IntegerField()
    avg_resolution_time = serializers.FloatField()
    disputes_by_type = serializers.DictField()
    disputes_by_status = serializers.DictField()
    monthly_disputes = serializers.ListField()