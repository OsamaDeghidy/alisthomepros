from rest_framework import serializers
from .models import Contract, ContractMilestone, ContractDocument, ContractLocation, ContractCalendarEvent, ContractInstallment
from .contract_payments import ContractPayment
from authentication.models import User


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer for user details in contracts"""
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'avatar', 'name']
        read_only_fields = ['id']
    
    def get_name(self, obj):
        return f"{obj.first_name or ''} {obj.last_name or ''}".strip()


class ContractSerializer(serializers.ModelSerializer):
    """Serializer أساسي للعقود"""
    available_contract_balance = serializers.ReadOnlyField()
    
    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'title', 'description',
            'client', 'professional', 'project',
            'total_amount', 'contract_balance', 'professional_balance', 'paid_amount', 'remaining_amount',
            'available_contract_balance',
            'payment_type', 'hourly_rate',
            'start_date', 'end_date', 'actual_end_date',
            'status', 'completion_percentage',
            'client_signed', 'professional_signed',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'contract_number', 'remaining_amount', 'available_contract_balance',
            'client_signed', 'professional_signed',
            'created_at', 'updated_at'
        ]


class ContractMilestoneSerializer(serializers.ModelSerializer):
    """Serializer لمراحل العقد"""
    
    class Meta:
        model = ContractMilestone
        fields = [
            'id', 'contract', 'title', 'description',
            'amount', 'due_date', 'status',
            'completion_date', 'payment_date', 'order',
            'created_at', 'updated_at'
        ]


class ContractDocumentSerializer(serializers.ModelSerializer):
    """Serializer لمستندات العقد"""
    
    class Meta:
        model = ContractDocument
        fields = [
            'id', 'contract', 'name', 'document_type',
            'file', 'uploaded_by', 'is_signed',
            'created_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at']


class ContractLocationSerializer(serializers.ModelSerializer):
    """Serializer لمواقع العقد"""
    
    class Meta:
        model = ContractLocation
        fields = [
            'id', 'contract', 'name', 'address', 'city', 'state',
            'zip_code', 'country', 'latitude', 'longitude',
            'is_primary', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContractCalendarEventSerializer(serializers.ModelSerializer):
    """Serializer لأحداث تقويم العقد (المواعيد)"""
    
    class Meta:
        model = ContractCalendarEvent
        fields = [
            'id', 'contract', 'title', 'description', 'event_type',
            'date', 'start_time', 'end_time', 'location', 'status',
            'priority', 'assigned_to', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContractInstallmentSerializer(serializers.ModelSerializer):
    """Serializer للأقساط"""
    
    class Meta:
        model = ContractInstallment
        fields = [
            'id', 'contract', 'amount', 'description', 'status',
            'created_at', 'confirmed_at', 'transferred_at',
            'net_amount_to_professional', 'platform_commission_amount'
        ]
        read_only_fields = [
            'id', 'created_at', 'confirmed_at', 'transferred_at',
            'net_amount_to_professional', 'platform_commission_amount'
        ]


class ContractPaymentSerializer(serializers.ModelSerializer):
    """Serializer for contract payments"""
    requested_by_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    is_available_to_professional = serializers.ReadOnlyField()
    
    class Meta:
        model = ContractPayment
        fields = [
            'id', 'payment_id', 'contract', 'amount', 'description',
            'platform_commission_rate', 'platform_commission_amount',
            'net_amount_to_professional', 'status',
            'requested_by', 'requested_by_name', 'approved_by', 'approved_by_name',
            'is_available_to_professional',
            'created_at', 'approved_at', 'transferred_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'payment_id', 'contract', 'requested_by', 'platform_commission_amount',
            'net_amount_to_professional', 'approved_by', 'approved_at',
            'transferred_at', 'completed_at', 'is_available_to_professional'
        ]
    
    def validate_amount(self, value):
        """Validate payment amount"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Validating payment amount: {value}")
        
        if value <= 0:
            logger.warning(f"Invalid amount: {value} (must be positive)")
            raise serializers.ValidationError("Payment amount must be greater than 0")
        
        # Check if amount exceeds contract balance (if contract is available in context)
        contract = self.context.get('contract')
        if contract:
            logger.info(f"Contract balance check: Requested ${value}, Available ${contract.available_contract_balance}")
            if value > contract.available_contract_balance:
                logger.warning(f"Insufficient contract balance: Requested ${value}, Available ${contract.available_contract_balance}")
                raise serializers.ValidationError(
                    f"Payment amount (${value}) exceeds available contract balance (${contract.available_contract_balance})"
                )
        else:
            logger.warning("No contract found in serializer context")
        
        return value
    
    def validate_description(self, value):
        """Validate description"""
        if value and len(value.strip()) > 500:
            raise serializers.ValidationError("Description cannot exceed 500 characters")
        return value.strip() if value else ''
    
    def validate(self, attrs):
        """Cross-field validation"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"ContractPaymentSerializer validate called with attrs: {attrs}")
        logger.info(f"Serializer context: {self.context}")
        
        # Additional validation can be added here if needed
        return attrs
    
    def get_requested_by_name(self, obj):
        if obj.requested_by:
            return f"{obj.requested_by.first_name or ''} {obj.requested_by.last_name or ''}".strip()
        return None
    
    def get_approved_by_name(self, obj):
        if obj.approved_by:
            return f"{obj.approved_by.first_name or ''} {obj.approved_by.last_name or ''}".strip()
        return None


class ContractDetailSerializer(serializers.ModelSerializer):
    """Serializer تفصيلي للعقود"""
    professional = UserDetailSerializer(read_only=True)
    client = UserDetailSerializer(read_only=True)
    milestones = ContractMilestoneSerializer(many=True, read_only=True)
    documents = ContractDocumentSerializer(many=True, read_only=True)
    installments = ContractInstallmentSerializer(many=True, read_only=True)
    payments = ContractPaymentSerializer(many=True, read_only=True, source='contractpayment_set')
    available_contract_balance = serializers.ReadOnlyField()
    
    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'title', 'description',
            'client', 'professional', 'project',
            'total_amount', 'contract_balance', 'professional_balance', 'paid_amount', 'remaining_amount',
            'available_contract_balance',
            'payment_type', 'hourly_rate',
            'start_date', 'end_date', 'actual_end_date',
            'status', 'completion_percentage',
            'terms_and_conditions', 'warranty_period', 'payment_terms',
            'client_signed', 'professional_signed',
            'client_signed_date', 'professional_signed_date',
            'milestones', 'documents', 'installments', 'payments',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'contract_number', 'remaining_amount', 'available_contract_balance',
            'client_signed', 'professional_signed',
            'created_at', 'updated_at'
        ]