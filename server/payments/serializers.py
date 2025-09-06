from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PaymentMethod, Payment, Withdrawal, BankAccount
from datetime import datetime, timedelta

User = get_user_model()


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer لطرق الدفع"""
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'type', 'provider', 'last4', 'expiry_date',
            'cardholder_name', 'is_default', 'is_verified',
            'bank_name', 'account_holder_name', 'account_number',
            'routing_number', 'iban', 'swift_code',
            'billing_address_line1', 'billing_address_line2',
            'billing_city', 'billing_state', 'billing_postal_code',
            'billing_country', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'is_verified', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'stripe_payment_method_id': {'write_only': True},
            'account_number': {'write_only': True}  # Hide sensitive data
        }
    
    def validate_expiry_date(self, value):
        """Validate expiry date format"""
        if value and not value.match(r'^\d{2}/\d{2}$'):
            raise serializers.ValidationError("Expiry date must be in MM/YY format")
        return value


class BankAccountSerializer(serializers.ModelSerializer):
    """Serializer for bank accounts"""
    
    account_number_masked = serializers.SerializerMethodField()
    
    class Meta:
        model = BankAccount
        fields = [
            'id', 'full_legal_name', 'bank_name', 'account_number_masked',
            'routing_number', 'account_type', 'business_name', 'business_ein',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code',
            'country', 'phone_number', 'status', 'is_default', 'kyc_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'account_number_masked', 'status', 'kyc_verified',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'account_number': {'write_only': True},
            'ssn_last4': {'write_only': True}
        }
    
    def get_account_number_masked(self, obj):
        """Return masked account number for security"""
        if obj.account_number:
            return f"****{obj.account_number[-4:]}"
        return ""


class BankAccountCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bank accounts"""
    
    class Meta:
        model = BankAccount
        fields = [
            'full_legal_name', 'bank_name', 'account_number', 'routing_number',
            'account_type', 'business_name', 'business_ein', 'ssn_last4',
            'date_of_birth', 'address_line1', 'address_line2', 'city', 'state',
            'postal_code', 'country', 'phone_number', 'is_default'
        ]
    
    def validate_routing_number(self, value):
        """Validate routing number format"""
        if len(value) != 9 or not value.isdigit():
            raise serializers.ValidationError("Routing number must be 9 digits")
        return value
    
    def validate_account_number(self, value):
        """Validate account number"""
        if len(value) < 4 or len(value) > 17:
            raise serializers.ValidationError("Account number must be between 4 and 17 digits")
        return value
    
    def validate_ssn_last4(self, value):
        """Validate SSN last 4 digits"""
        if value and (len(value) != 4 or not value.isdigit()):
            raise serializers.ValidationError("SSN last 4 must be exactly 4 digits")
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class WithdrawalSerializer(serializers.ModelSerializer):
    """Serializer for withdrawal requests"""
    
    user_info = serializers.SerializerMethodField()
    wallet_info = serializers.SerializerMethodField()
    bank_account_info = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    processing_timeline = serializers.SerializerMethodField()
    
    class Meta:
        model = Withdrawal
        fields = [
            'id', 'user_info', 'wallet_info', 'amount', 'currency',
            'processing_fee', 'net_amount', 'status', 'status_display',
            'bank_account_info', 'external_transaction_id', 'ach_trace_number',
            'estimated_arrival', 'processing_timeline', 'notes', 'failure_reason',
            'requested_at', 'processed_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'user_info', 'wallet_info', 'bank_account_info',
            'processing_fee', 'net_amount', 'status_display', 'processing_timeline',
            'external_transaction_id', 'ach_trace_number', 'estimated_arrival',
            'failure_reason', 'requested_at', 'processed_at', 'completed_at'
        ]
    
    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email
        }
    
    def get_wallet_info(self, obj):
        return {
            'id': obj.wallet.id,
            'available_balance': obj.wallet.available_balance
        }
    
    def get_bank_account_info(self, obj):
        if obj.bank_account:
            return {
                'id': obj.bank_account.id,
                'bank_name': obj.bank_account.bank_name,
                'account_holder': obj.bank_account.full_legal_name,
                'account_number_masked': f"****{obj.bank_account.account_number[-4:]}",
                'account_type': obj.bank_account.account_type
            }
        return None
    
    def get_status_display(self, obj):
        status_messages = {
            'pending': 'Withdrawal request submitted and under review',
            'processing': 'Withdrawal is being processed by our payment processor',
            'completed': 'Funds have been successfully transferred to your bank account',
            'failed': 'Withdrawal failed - please contact support',
            'cancelled': 'Withdrawal was cancelled'
        }
        return status_messages.get(obj.status, obj.status)
    
    def get_processing_timeline(self, obj):
        """Get processing timeline information"""
        timeline = {
            'requested': obj.requested_at,
            'estimated_completion': None,
            'business_days_remaining': None
        }
        
        if obj.status == 'processing' and obj.processed_at:
            # ACH transfers typically take 1-3 business days
            estimated_completion = obj.processed_at + timedelta(days=3)
            timeline['estimated_completion'] = estimated_completion
            
            # Calculate business days remaining (simplified)
            days_diff = (estimated_completion.date() - datetime.now().date()).days
            timeline['business_days_remaining'] = max(0, days_diff)
        
        return timeline


class WithdrawalCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating withdrawal requests"""
    
    class Meta:
        model = Withdrawal
        fields = [
            'amount', 'currency', 'bank_account', 'notes'
        ]
    
    def validate_amount(self, value):
        """Validate withdrawal amount"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        
        # Check minimum withdrawal amount (typically $20)
        if value < 20:
            raise serializers.ValidationError("Minimum withdrawal amount is $20")
        
        return value
    
    def validate_bank_account(self, value):
        """Validate bank account belongs to user and is verified"""
        user = self.context['request'].user
        
        if not value:
            raise serializers.ValidationError("Bank account is required")
        
        if value.user != user:
            raise serializers.ValidationError("Bank account does not belong to you")
        
        if not value.kyc_verified:
            raise serializers.ValidationError("Bank account must be verified before withdrawals")
        
        if value.status != 'verified':
            raise serializers.ValidationError("Bank account is not verified")
        
        return value
    
    def validate(self, attrs):
        """Validate withdrawal request"""
        from decimal import Decimal
        
        user = self.context['request'].user
        wallet = getattr(user, 'wallet', None)
        
        if not wallet:
            raise serializers.ValidationError("User does not have a wallet")
        
        amount = attrs['amount']
        
        # Calculate processing fee (typically $0.25 for ACH)
        processing_fee = Decimal('0.25')
        total_deduction = amount + processing_fee
        
        if total_deduction > wallet.available_balance:
            raise serializers.ValidationError(
                f"Insufficient funds. Amount + processing fee (${processing_fee}) = ${total_deduction}. "
                f"Available balance: ${wallet.available_balance}"
            )
        
        attrs['processing_fee'] = processing_fee
        
        return attrs
    
    def create(self, validated_data):
        from decimal import Decimal
        from .models import Wallet
        
        user = self.context['request'].user
        
        # Get user's wallet
        try:
            wallet = Wallet.objects.get(user=user)
        except Wallet.DoesNotExist:
            raise serializers.ValidationError("User wallet not found")
        
        processing_fee = validated_data.pop('processing_fee')
        
        # Create withdrawal request
        withdrawal = Withdrawal.objects.create(
            user=user,
            wallet=wallet,
            processing_fee=processing_fee,
            **validated_data
        )
        
        # Set estimated arrival (1-3 business days)
        from datetime import datetime, timedelta
        withdrawal.estimated_arrival = datetime.now() + timedelta(days=3)
        withdrawal.save()
        
        return withdrawal


class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payment methods"""
    stripe_token = serializers.CharField(write_only=True, required=False, allow_blank=True)
    card_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    expiry_date = serializers.CharField(write_only=True, required=False, allow_blank=True)
    cvv = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = PaymentMethod
        fields = [
            'type', 'provider', 'stripe_token', 'cardholder_name', 'is_default',
            'card_number', 'expiry_date', 'cvv',
            'bank_name', 'account_holder_name', 'account_number',
            'routing_number', 'iban', 'swift_code',
            'billing_address_line1', 'billing_address_line2',
            'billing_city', 'billing_state', 'billing_postal_code',
            'billing_country'
        ]
    
    def validate(self, attrs):
        """Validate payment method data based on type"""
        payment_type = attrs.get('type')
        
        if payment_type == 'card':
            # For card payments, we need at least cardholder_name
            if not attrs.get('cardholder_name'):
                attrs['cardholder_name'] = 'Test User'  # Default for testing
        elif payment_type == 'bank_account':
            # For bank accounts, we need account holder name
            if not attrs.get('account_holder_name'):
                attrs['account_holder_name'] = 'Test User'  # Default for testing
        
        return attrs
    
    def create(self, validated_data):
        stripe_token = validated_data.pop('stripe_token', None)
        card_number = validated_data.pop('card_number', '')
        expiry_date = validated_data.pop('expiry_date', '')
        cvv = validated_data.pop('cvv', '')
        
        validated_data['user'] = self.context['request'].user
        
        # Extract last 4 digits from card number if provided
        if card_number:
            validated_data['last4'] = card_number[-4:] if len(card_number) >= 4 else '0000'
        else:
            validated_data['last4'] = '1111'  # Default for test
        
        # Set expiry date if provided
        if expiry_date:
            validated_data['expiry_date'] = expiry_date
        else:
            validated_data['expiry_date'] = '12/25'  # Default for test
        
        # Set provider based on card type or use provided provider
        if not validated_data.get('provider'):
            if validated_data.get('type') == 'card':
                validated_data['provider'] = 'authorize_net'  # Using Authorize.Net for testing
            else:
                validated_data['provider'] = 'stripe'
        
        validated_data['is_verified'] = True  # Auto-verify for testing
        
        # If this is set as default, unset other defaults
        if validated_data.get('is_default', False):
            PaymentMethod.objects.filter(
                user=validated_data['user'],
                is_default=True
            ).update(is_default=False)
        
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer للمدفوعات"""
    payer_info = serializers.SerializerMethodField()
    payee_info = serializers.SerializerMethodField()
    contract_info = serializers.SerializerMethodField()
    payment_method_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'amount', 'currency', 'status', 'payment_type',
            'payer_info', 'payee_info', 'contract_info', 'milestone',
            'payment_method_info', 'description', 'created_at',
            'updated_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'payment_id', 'status', 'created_at',
            'updated_at', 'processed_at'
        ]
    
    def get_payer_info(self, obj):
        return {
            'id': obj.payer.id,
            'name': obj.payer.get_full_name(),
            'email': obj.payer.email,
            'avatar': obj.payer.avatar.url if obj.payer.avatar else None
        }
    
    def get_payee_info(self, obj):
        return {
            'id': obj.payee.id,
            'name': obj.payee.get_full_name(),
            'email': obj.payee.email,
            'avatar': obj.payee.avatar.url if obj.payee.avatar else None
        }
    
    def get_contract_info(self, obj):
        if obj.contract:
            return {
                'id': obj.contract.id,
                'title': obj.contract.title,
                'contract_number': obj.contract.contract_number
            }
        return None
    
    def get_payment_method_info(self, obj):
        if obj.payment_method:
            return {
                'id': obj.payment_method.id,
                'type': obj.payment_method.type,
                'provider': obj.payment_method.provider,
                'last4': obj.payment_method.last4
            }
        return None


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer لإنشاء دفعة جديدة"""
    
    class Meta:
        model = Payment
        fields = [
            'amount', 'currency', 'payee', 'contract', 'milestone',
            'payment_method', 'description'
        ]
    
    def validate_amount(self, value):
        """Validate payment amount"""
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be positive")
        return value
    
    def validate_payment_method(self, value):
        """Validate payment method belongs to user"""
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Invalid payment method")
        return value
    
    def validate(self, attrs):
        """Validate payment data"""
        contract = attrs.get('contract')
        milestone = attrs.get('milestone')
        
        if milestone and milestone.contract != contract:
            raise serializers.ValidationError("Milestone must belong to the contract")
        
        if contract and contract.client != self.context['request'].user:
            raise serializers.ValidationError("You can only make payments for your own contracts")
        
        return attrs
    
    def create(self, validated_data):
        # Set payer from request user
        validated_data['payer'] = self.context['request'].user
        validated_data['status'] = 'pending'
        
        return super().create(validated_data)


class PaymentProcessSerializer(serializers.Serializer):
    """Serializer لمعالجة الدفع"""
    payment_id = serializers.IntegerField()
    stripe_payment_intent_id = serializers.CharField(required=False)
    
    def validate_payment_id(self, value):
        """Validate payment exists and belongs to user"""
        try:
            payment = Payment.objects.get(id=value)
            if payment.payer != self.context['request'].user:
                raise serializers.ValidationError("Payment not found")
            if payment.status != 'pending':
                raise serializers.ValidationError("Payment cannot be processed")
            return value
        except Payment.DoesNotExist:
            raise serializers.ValidationError("Payment not found")


class PaymentStatsSerializer(serializers.Serializer):
    """Serializer لإحصائيات المدفوعات"""
    total_payments = serializers.IntegerField()
    total_amount_paid = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_amount_received = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_payments = serializers.IntegerField()
    succeeded_payments = serializers.IntegerField()
    failed_payments = serializers.IntegerField()
    total_refunds = serializers.DecimalField(max_digits=15, decimal_places=2)
    current_month_payments = serializers.DecimalField(max_digits=15, decimal_places=2)
    current_month_earnings = serializers.DecimalField(max_digits=15, decimal_places=2)


class PaymentHistorySerializer(serializers.ModelSerializer):
    """Serializer لتاريخ المدفوعات"""
    payment_type_display = serializers.SerializerMethodField()
    related_user = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'amount', 'currency', 'status', 'payment_type',
            'payment_type_display', 'related_user', 'description',
            'created_at', 'processed_at'
        ]
    
    def get_payment_type_display(self, obj):
        """Get payment type based on user perspective"""
        user = self.context['request'].user
        if obj.payer == user:
            return 'outgoing'
        elif obj.payee == user:
            return 'incoming'
        return 'unknown'
    
    def get_related_user(self, obj):
        """Get the other party in the transaction"""
        user = self.context['request'].user
        if obj.payer == user:
            other_user = obj.payee
        else:
            other_user = obj.payer
        
        return {
            'id': other_user.id,
            'name': other_user.get_full_name(),
            'avatar': other_user.avatar.url if other_user.avatar else None
        }


class PaymentSummarySerializer(serializers.Serializer):
    """Serializer لملخص المدفوعات"""
    contract_id = serializers.IntegerField()
    contract_title = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    paid_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    remaining_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    payment_count = serializers.IntegerField()
    last_payment_date = serializers.DateTimeField()
    completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


# Import models for validation
from django.db import models
from .models import Wallet, WalletTransaction


class WalletSerializer(serializers.ModelSerializer):
    """Serializer للمحفظة"""
    user_info = serializers.SerializerMethodField()
    total_balance = serializers.SerializerMethodField()
    
    class Meta:
        model = Wallet
        fields = [
            'id', 'user_info', 'available_balance', 'pending_balance',
            'total_earned', 'total_balance', 'currency', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_info', 'total_balance', 'created_at', 'updated_at'
        ]
    
    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'full_name': obj.user.get_full_name(),
            'email': obj.user.email
        }
    
    def get_total_balance(self, obj):
        return obj.total_balance


class WalletTransactionSerializer(serializers.ModelSerializer):
    """Serializer لمعاملات المحفظة"""
    wallet_info = serializers.SerializerMethodField()
    payment_info = serializers.SerializerMethodField()
    
    class Meta:
        model = WalletTransaction
        fields = [
            'id', 'wallet_info', 'amount', 'transaction_type', 'source',
            'description', 'payment_info', 'created_at'
        ]
        read_only_fields = ['id', 'wallet_info', 'payment_info', 'created_at']
    
    def get_wallet_info(self, obj):
        return {
            'id': obj.wallet.id,
            'user': obj.wallet.user.get_full_name()
        }
    
    def get_payment_info(self, obj):
        if obj.payment:
            return {
                'id': obj.payment.id,
                'payment_id': obj.payment.payment_id,
                'amount': obj.payment.amount
            }
        return None


class WalletTopUpSerializer(serializers.Serializer):
    """Serializer لشحن المحفظة"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=1)
    payment_method_id = serializers.IntegerField()
    description = serializers.CharField(max_length=255, required=False)
    
    def validate_payment_method_id(self, value):
        user = self.context['request'].user
        try:
            payment_method = PaymentMethod.objects.get(id=value, user=user)
            return value
        except PaymentMethod.DoesNotExist:
            raise serializers.ValidationError("Payment method not found or doesn't belong to user")
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        if value > 10000:  # Maximum top-up limit
            raise serializers.ValidationError("Amount cannot exceed $10,000")
        return value