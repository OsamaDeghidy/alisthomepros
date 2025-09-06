from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import uuid

User = get_user_model()


class Currency(models.Model):
    """العملات المدعومة"""
    code = models.CharField(max_length=3, unique=True)  # USD, EUR, etc.
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=6, default=1.0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'currencies'
        verbose_name = 'Currency'
        verbose_name_plural = 'Currencies'
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Wallet(models.Model):
    """محفظة المستخدم الرقمية"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    
    # Available balance (can be withdrawn)
    available_balance = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Pending balance (in escrow or processing)
    pending_balance = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Total earned (lifetime)
    total_earned = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Currency
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'wallets'
        verbose_name = 'Wallet'
        verbose_name_plural = 'Wallets'
    
    def __str__(self):
        return f"{self.user.username} - ${self.available_balance}"
    
    @property
    def total_balance(self):
        """Total balance (available + pending)"""
        return self.available_balance + self.pending_balance
    
    def add_funds(self, amount, source='payment'):
        """Add funds to available balance"""
        self.available_balance += amount
        
        # Only update total_earned for legitimate earnings (not top-ups)
        legitimate_sources = [
            'escrow_release', 'project_payment', 
            'milestone_payment', 'contract_payment', 'platform_earning'
        ]
        if source in legitimate_sources:
            self.total_earned += amount
            
        self.save()
        
        # Create transaction record
        WalletTransaction.objects.create(
            wallet=self,
            amount=amount,
            transaction_type='credit',
            source=source,
            description=f"Funds added from {source}"
        )
    
    def deduct_funds(self, amount, reason='withdrawal'):
        """Deduct funds from available balance"""
        if self.available_balance >= amount:
            self.available_balance -= amount
            self.save()
            
            # Create transaction record
            WalletTransaction.objects.create(
                wallet=self,
                amount=-amount,
                transaction_type='debit',
                source=reason,
                description=f"Funds deducted for {reason}"
            )
            return True
        return False
    
    def move_to_pending(self, amount):
        """Move funds from available to pending"""
        if self.available_balance >= amount:
            self.available_balance -= amount
            self.pending_balance += amount
            self.save()
            return True
        return False
    
    def release_pending(self, amount):
        """Release pending funds to available"""
        if self.pending_balance >= amount:
            self.pending_balance -= amount
            self.available_balance += amount
            self.save()
            return True
        return False


class WalletTransaction(models.Model):
    """معاملات المحفظة"""
    TRANSACTION_TYPES = [
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    ]
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    source = models.CharField(max_length=100)  # payment, withdrawal, refund, etc.
    description = models.TextField(blank=True)
    
    # Reference to related objects
    payment = models.ForeignKey('Payment', on_delete=models.SET_NULL, null=True, blank=True)
    escrow = models.ForeignKey('EscrowAccount', on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'wallet_transactions'
        verbose_name = 'Wallet Transaction'
        verbose_name_plural = 'Wallet Transactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.wallet.user.username} - {self.transaction_type} ${self.amount}"


class EscrowAccount(models.Model):
    """حساب Escrow لحماية الدفعات"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('funded', 'Funded'),
        ('released', 'Released'),
        ('disputed', 'Disputed'),
        ('refunded', 'Refunded'),
        ('expired', 'Expired'),
    ]
    
    # Basic Info
    escrow_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Parties
    client = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='client_escrows',
        limit_choices_to={'user_type': 'client'}
    )
    professional = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='professional_escrows',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    
    # Project/Contract Reference
    contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE, related_name='escrows')
    milestone = models.ForeignKey(
        'contracts.ContractMilestone', 
        on_delete=models.CASCADE, 
        related_name='escrows',
        null=True, 
        blank=True
    )
    
    # Financial Details
    amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)
    
    # Platform Fees
    platform_fee_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=0.10,  # 10%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    platform_fee_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Processing Fees
    processing_fee_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=0.029,  # 2.9%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    processing_fee_fixed = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.30,  # $0.30
        validators=[MinValueValidator(0)]
    )
    processing_fee_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Net amount to professional after fees
    net_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Status and Dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    funded_at = models.DateTimeField(null=True, blank=True)
    release_date = models.DateTimeField(null=True, blank=True)
    auto_release_date = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    
    # Terms
    terms_accepted = models.BooleanField(default=False)
    auto_release_days = models.PositiveIntegerField(default=7)  # Auto-release after 7 days
    
    # Dispute
    dispute_reason = models.TextField(blank=True)
    dispute_raised_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='raised_disputes'
    )
    dispute_raised_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'escrow_accounts'
        verbose_name = 'Escrow Account'
        verbose_name_plural = 'Escrow Accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Escrow {self.escrow_id} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        """Calculate fees and net amount"""
        if self.amount:
            # Calculate platform fee
            self.platform_fee_amount = self.amount * self.platform_fee_rate
            
            # Calculate processing fee
            self.processing_fee_amount = (self.amount * self.processing_fee_rate) + self.processing_fee_fixed
            
            # Calculate net amount to professional
            total_fees = self.platform_fee_amount + self.processing_fee_amount
            self.net_amount = self.amount - total_fees
        
        super().save(*args, **kwargs)
    
    def fund_escrow(self):
        """Fund the escrow account"""
        self.status = 'funded'
        self.funded_at = timezone.now()
        
        # Calculate auto-release date
        if self.auto_release_days:
            self.auto_release_date = timezone.now() + timedelta(days=self.auto_release_days)
        
        self.save()
    
    def release_funds(self, released_by=None):
        """Release funds to professional"""
        if self.status == 'funded':
            # Add funds to professional's wallet
            professional_wallet, created = Wallet.objects.get_or_create(user=self.professional)
            professional_wallet.add_funds(self.net_amount, source='escrow_release')
            
            # Update escrow status
            self.status = 'released'
            self.released_at = timezone.now()
            self.save()
            
            # Create payment record
            Payment.objects.create(
                escrow=self,
                payer=self.client,
                payee=self.professional,
                amount=self.amount,
                net_amount=self.net_amount,
                platform_fee=self.platform_fee_amount,
                processing_fee=self.processing_fee_amount,
                currency=self.currency,
                status='succeeded',
                payment_type='escrow_release',
                description=f"Escrow release for {self.contract.title}"
            )
            
            return True
        return False
    
    def refund_escrow(self, reason=''):
        """Refund escrow to client"""
        if self.status in ['funded', 'disputed']:
            # Refund to client (minus processing fees already charged)
            refund_amount = self.amount - self.processing_fee_amount
            
            self.status = 'refunded'
            self.dispute_reason = reason
            self.save()
            
            # Create refund payment record
            Payment.objects.create(
                escrow=self,
                payer=self.professional,  # Conceptually
                payee=self.client,
                amount=refund_amount,
                currency=self.currency,
                status='succeeded',
                payment_type='refund',
                description=f"Escrow refund: {reason}"
            )
            
            return True
        return False


class PaymentMethod(models.Model):
    """طرق الدفع"""
    TYPE_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('authorize_net', 'Authorize.Net'),
        ('wallet', 'Wallet Balance'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=50)  # Visa, MasterCard, etc.
    last4 = models.CharField(max_length=4, blank=True)
    expiry_date = models.CharField(max_length=7, blank=True)  # MM/YY
    cardholder_name = models.CharField(max_length=255, blank=True)
    is_default = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Bank account details for withdrawals
    bank_name = models.CharField(max_length=255, blank=True)
    account_holder_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    routing_number = models.CharField(max_length=20, blank=True)
    iban = models.CharField(max_length=34, blank=True)  # International Bank Account Number
    swift_code = models.CharField(max_length=11, blank=True)  # SWIFT/BIC code
    
    # Card billing address
    billing_address_line1 = models.CharField(max_length=255, blank=True)
    billing_address_line2 = models.CharField(max_length=255, blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_postal_code = models.CharField(max_length=20, blank=True)
    billing_country = models.CharField(max_length=2, blank=True)  # ISO country code
    
    # Stripe integration
    stripe_payment_method_id = models.CharField(max_length=255, blank=True)
    
    # Authorize.Net integration
    authorize_net_customer_profile_id = models.CharField(max_length=255, blank=True)
    authorize_net_payment_profile_id = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
    
    def __str__(self):
        return f"{self.user.username} - {self.provider} ending in {self.last4}"


class Payment(models.Model):
    """المدفوعات المحسنة"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    TYPE_CHOICES = [
        ('project_payment', 'Project Payment'),
        ('milestone_payment', 'Milestone Payment'),
        ('escrow_release', 'Escrow Release'),
        ('subscription', 'Subscription'),
        ('refund', 'Refund'),
        ('withdrawal', 'Withdrawal'),
        ('platform_fee', 'Platform Fee'),
        ('wallet_topup', 'Wallet Top-up'),
    ]
    
    # Payment Details
    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        validators=[MinValueValidator(0)]
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='project_payment')
    
    # Parties
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_made')
    payee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_received')
    
    # References
    contract = models.ForeignKey(
        'contracts.Contract', 
        on_delete=models.CASCADE, 
        related_name='payments', 
        null=True, 
        blank=True
    )
    milestone = models.ForeignKey(
        'contracts.ContractMilestone', 
        on_delete=models.CASCADE, 
        related_name='payments', 
        null=True, 
        blank=True
    )
    escrow = models.ForeignKey(
        EscrowAccount, 
        on_delete=models.CASCADE, 
        related_name='payments', 
        null=True, 
        blank=True
    )
    
    # Payment Method
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Fee Breakdown
    gross_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    platform_fee = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    processing_fee = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    net_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # External IDs
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    
    # Authorize.Net integration
    authorize_net_transaction_id = models.CharField(max_length=255, blank=True)
    authorize_net_auth_code = models.CharField(max_length=50, blank=True)
    authorize_net_response_code = models.CharField(max_length=10, blank=True)
    
    # Metadata
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['payment_type']),
            models.Index(fields=['payer']),
            models.Index(fields=['payee']),
        ]
    
    def __str__(self):
        return f"Payment {self.payment_id} - ${self.amount}"


class BankAccount(models.Model):
    """Bank accounts for withdrawals with KYC information"""
    
    ACCOUNT_TYPE_CHOICES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('business', 'Business'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bank_accounts')
    
    # Required bank information
    full_legal_name = models.CharField(max_length=255, help_text="Must match bank account")
    bank_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    routing_number = models.CharField(max_length=20, help_text="ACH routing number")
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='checking')
    
    # Business information (if applicable)
    business_name = models.CharField(max_length=255, blank=True)
    business_ein = models.CharField(max_length=20, blank=True, help_text="Employer Identification Number")
    
    # Personal information for KYC
    ssn_last4 = models.CharField(max_length=4, blank=True, help_text="Last 4 digits of SSN")
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Address information
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=2, default='US', help_text="ISO country code")
    
    # Contact information
    phone_number = models.CharField(max_length=20)
    
    # Verification status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_default = models.BooleanField(default=False)
    
    # KYC verification
    kyc_verified = models.BooleanField(default=False)
    kyc_verified_at = models.DateTimeField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)
    
    # External processor IDs
    stripe_account_id = models.CharField(max_length=255, blank=True)
    authorize_net_profile_id = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bank_accounts'
        verbose_name = 'Bank Account'
        verbose_name_plural = 'Bank Accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_legal_name} - {self.bank_name} ****{self.account_number[-4:]}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default bank account per user
        if self.is_default:
            BankAccount.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class Withdrawal(models.Model):
    """طلبات السحب من المحفظة"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='withdrawals')
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='withdrawals')
    
    amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default=1)
    
    # Processing fees
    processing_fee = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    net_amount = models.DecimalField(
        max_digits=15, 
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Status and processing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # External transaction tracking
    external_transaction_id = models.CharField(max_length=255, blank=True)
    ach_trace_number = models.CharField(max_length=50, blank=True)
    
    # Processing timeline
    estimated_arrival = models.DateTimeField(null=True, blank=True, help_text="Estimated arrival date (1-3 business days)")
    
    # Notes
    notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    failure_reason = models.TextField(blank=True)
    
    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'withdrawals'
        verbose_name = 'Withdrawal'
        verbose_name_plural = 'Withdrawals'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user.username} - ${self.amount} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Calculate net amount after processing fees
        if not self.net_amount:
            self.net_amount = self.amount - self.processing_fee
        super().save(*args, **kwargs)


class PlatformFeeSettings(models.Model):
    """إعدادات عمولة المنصة"""
    
    # Fee rates
    platform_fee_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=0.10,  # 10%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    processing_fee_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=0.029,  # 2.9%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    processing_fee_fixed = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.30,  # $0.30
        validators=[MinValueValidator(0)]
    )
    
    # Minimum amounts
    minimum_payment = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=1.00,
        validators=[MinValueValidator(0)]
    )
    
    minimum_withdrawal = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=20.00,
        validators=[MinValueValidator(0)]
    )
    
    # Settings
    auto_release_days = models.PositiveIntegerField(default=7)
    max_dispute_days = models.PositiveIntegerField(default=30)
    
    # Active settings
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'platform_fee_settings'
        verbose_name = 'Platform Fee Settings'
        verbose_name_plural = 'Platform Fee Settings'
    
    def __str__(self):
        return f"Platform Fee: {self.platform_fee_rate * 100}%"


# Import timezone for models
from django.utils import timezone
from datetime import timedelta
