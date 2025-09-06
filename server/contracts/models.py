from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid

User = get_user_model()


class Contract(models.Model):
    """
    نموذج العقود
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('disputed', 'Disputed'),
    ]
    
    PAYMENT_TYPE_CHOICES = [
        ('fixed', 'Fixed Price'),
        ('hourly', 'Hourly Rate'),
        ('milestone', 'Milestone-based'),
    ]
    
    # Basic Information
    contract_number = models.CharField(max_length=50, unique=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Parties
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='client_contracts',
        limit_choices_to={'user_type': 'client'}
    )
    professional = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='professional_contracts',
        limit_choices_to={'user_type__in': ['home_pro', 'specialist', 'crew_member']}
    )
    
    # Project Reference
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='contracts',
        null=True,
        blank=True
    )
    
    # Financial Details
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    paid_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Contract balance - funds allocated to this contract from client's wallet
    contract_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Funds allocated from client's wallet to this contract"
    )
    
    # Professional balance - funds transferred to professional after project completion
    professional_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Funds transferred to professional's pending balance (available after 3 days)"
    )
    
    # Professional balance release date - when funds become available to professional
    professional_balance_release_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Date when professional balance becomes available (3 days after transfer)"
    )
    
    # Platform commission rate (default 15%)
    platform_commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        default=0.15,  # 15%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    payment_type = models.CharField(
        max_length=20,
        choices=PAYMENT_TYPE_CHOICES,
        default='fixed'
    )
    hourly_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Timeline
    start_date = models.DateField()
    end_date = models.DateField()
    actual_end_date = models.DateField(null=True, blank=True)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    # Contract Terms
    terms_and_conditions = models.TextField(blank=True)
    warranty_period = models.CharField(max_length=100, blank=True)
    payment_terms = models.CharField(max_length=255, blank=True)
    
    # Signatures
    client_signed = models.BooleanField(default=False)
    professional_signed = models.BooleanField(default=False)
    client_signed_date = models.DateTimeField(null=True, blank=True)
    professional_signed_date = models.DateTimeField(null=True, blank=True)
    
    # Completion
    completion_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(100)]
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contracts'
        verbose_name = 'Contract'
        verbose_name_plural = 'Contracts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['client']),
            models.Index(fields=['professional']),
            models.Index(fields=['start_date']),
            models.Index(fields=['end_date']),
        ]
    
    def __str__(self):
        return f"{self.contract_number} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.contract_number:
            self.contract_number = f"CON-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)
    
    @property
    def remaining_amount(self):
        """Calculate remaining amount to be paid"""
        if self.total_amount is None or self.paid_amount is None:
            return 0
        return self.total_amount - self.paid_amount
    
    @property
    def available_contract_balance(self):
        """Available balance for payments from contract funds"""
        if self.contract_balance is None:
            return 0
        
        # Calculate pending/approved payments that haven't been transferred yet
        from .contract_payments import ContractPayment
        pending_payments = ContractPayment.objects.filter(
            contract=self,
            status__in=['pending', 'approved']
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        return self.contract_balance - pending_payments
    
    @property
    def is_professional_balance_available(self):
        """Check if professional balance is available for withdrawal"""
        if not self.professional_balance_release_date:
            return False
        return timezone.now() >= self.professional_balance_release_date
    
    @property
    def platform_commission_amount(self):
        """Calculate platform commission amount"""
        if self.total_amount is None or self.platform_commission_rate is None:
            return 0
        return self.total_amount * self.platform_commission_rate
    
    @property
    def net_amount_to_professional(self):
        """Amount professional will receive after platform commission"""
        if self.total_amount is None:
            return 0
        return self.total_amount - self.platform_commission_amount
    
    def is_fully_signed(self):
        return self.client_signed and self.professional_signed
    
    def is_active(self):
        return self.status == 'active'
    
    def is_completed(self):
        return self.status == 'completed'
    
    def has_sufficient_contract_balance(self, amount=None):
        """Check if contract has sufficient contract balance for a payment"""
        if amount is None:
            return self.available_contract_balance > 0
        return self.available_contract_balance >= amount
    
    def transfer_to_professional_balance(self, amount):
        """Transfer funds to professional balance with 3-day hold"""
        from payments.models import Wallet, WalletTransaction
        
        if self.available_contract_balance < amount:
            raise ValueError("Insufficient contract balance")
        
        # Calculate net amount after commission
        net_amount = amount * (1 - self.platform_commission_rate)
        
        # Update contract balances
        self.paid_amount += amount
        self.professional_balance += net_amount
        self.professional_balance_release_date = timezone.now() + timezone.timedelta(days=3)
        self.save()
        
        # Create transaction record for professional
        professional_wallet, created = Wallet.objects.get_or_create(user=self.professional)
        WalletTransaction.objects.create(
            wallet=professional_wallet,
            amount=net_amount,
            transaction_type='credit',
            source='contract_payment',
            description=f'Payment from contract {self.contract_number} (3-day hold)'
        )
        
        return {
            'gross_amount': amount,
            'net_amount': net_amount,
            'commission_amount': amount * self.platform_commission_rate,
            'release_date': self.professional_balance_release_date
        }
    
    def release_professional_balance(self):
        """Release professional balance to their wallet after hold period"""
        from payments.models import Wallet, WalletTransaction
        
        if not self.is_professional_balance_available:
            raise ValueError("Professional balance is not yet available for release")
        
        if self.professional_balance <= 0:
            return {'success': False, 'message': 'No balance to release'}
        
        # Transfer to professional's available balance
        professional_wallet, created = Wallet.objects.get_or_create(user=self.professional)
        professional_wallet.available_balance += self.professional_balance
        professional_wallet.save()
        
        # Create transaction record
        WalletTransaction.objects.create(
            wallet=professional_wallet,
            amount=self.professional_balance,
            transaction_type='credit',
            source='balance_release',
            description=f'Balance release from contract {self.contract_number}'
        )
        
        released_amount = self.professional_balance
        self.professional_balance = 0
        self.professional_balance_release_date = None
        self.save()
        
        return {
            'success': True,
            'released_amount': released_amount
        }
    
    def allocate_contract_funds(self, amount):
        """Allocate funds from client wallet to contract balance"""
        from payments.models import Wallet, WalletTransaction
        
        client_wallet, created = Wallet.objects.get_or_create(user=self.client)
        
        if client_wallet.available_balance >= amount:
            # Move funds from client's available to pending balance
            client_wallet.available_balance -= amount
            client_wallet.pending_balance += amount
            client_wallet.save()
            
            # Allocate to contract balance
            self.contract_balance += amount
            self.save()
            
            # Create transaction record
            WalletTransaction.objects.create(
                wallet=client_wallet,
                amount=-amount,
                transaction_type='debit',
                source='contract_allocation',
                description=f'Funds allocated to contract {self.contract_number}'
            )
            
            return True
        return False
    
    def complete_contract(self):
        """Complete contract and transfer remaining funds to professional"""
        from payments.models import Wallet, WalletTransaction
        
        if self.status != 'active':
            raise ValueError("Contract must be active to complete")
        
        remaining_balance = self.available_contract_balance
        net_amount = 0
        
        if remaining_balance > 0:
            # Calculate net amount after commission
            net_amount = remaining_balance * (1 - self.platform_commission_rate)
            
            # Update contract balances
            self.paid_amount += remaining_balance
            self.professional_balance += net_amount
            self.professional_balance_release_date = timezone.now() + timezone.timedelta(days=3)
            
            # Update client's pending balance (reduce by remaining amount)
            client_wallet, created = Wallet.objects.get_or_create(user=self.client)
            client_wallet.pending_balance -= remaining_balance
            client_wallet.save()
            
            # Create transaction record for client
            WalletTransaction.objects.create(
                wallet=client_wallet,
                amount=-remaining_balance,
                transaction_type='debit',
                source='contract_completion',
                description=f'Contract completion payment for {self.contract_number}'
            )
            
            # Create transaction record for professional
            professional_wallet, created = Wallet.objects.get_or_create(user=self.professional)
            WalletTransaction.objects.create(
                wallet=professional_wallet,
                amount=net_amount,
                transaction_type='credit',
                source='contract_completion',
                description=f'Contract completion payment from {self.contract_number} (3-day hold)'
            )
            
        self.status = 'completed'
        self.completion_percentage = 100
        self.actual_end_date = timezone.now().date()
        self.save()
        
        return {
            'status': 'completed',
            'remaining_balance': remaining_balance,
            'net_amount_to_professional': net_amount,
            'completion_date': self.actual_end_date,
            'professional_balance_release_date': self.professional_balance_release_date
        }


class ContractMilestone(models.Model):
    """
    مراحل العقد والدفعات المتكاملة
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('not_requested', 'Not Requested'),
        ('requested', 'Payment Requested'),
        ('approved', 'Payment Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Payment Rejected'),
    ]
    
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='milestones'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    due_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    completion_date = models.DateField(null=True, blank=True)
    payment_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    # Payment fields
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='not_requested'
    )
    payment_requested_at = models.DateTimeField(null=True, blank=True)
    payment_approved_at = models.DateTimeField(null=True, blank=True)
    payment_notes = models.TextField(blank=True)
    
    # Commission tracking
    platform_commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        default=0.15,  # 15%
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contract_milestones'
        verbose_name = 'Contract Milestone'
        verbose_name_plural = 'Contract Milestones'
        ordering = ['order', 'due_date']
        unique_together = ['contract', 'order']
    
    def __str__(self):
        return f"{self.contract.contract_number} - {self.title}"
    
    @property
    def platform_commission_amount(self):
        """Calculate platform commission for this milestone"""
        if self.amount is None or self.platform_commission_rate is None:
            return 0
        return self.amount * self.platform_commission_rate
    
    @property
    def net_amount_to_professional(self):
        """Amount professional will receive after commission"""
        if self.amount is None:
            return 0
        return self.amount - self.platform_commission_amount
    
    def request_payment(self, notes=''):
        """Request payment for this milestone"""
        if self.status != 'completed':
            raise ValueError("Milestone must be completed to request payment")
        
        self.payment_status = 'requested'
        self.payment_requested_at = timezone.now()
        self.payment_notes = notes
        self.save()
    
    def approve_payment(self, approved_by=None, notes=''):
        """Approve payment for this milestone"""
        if self.payment_status != 'requested':
            raise ValueError("Payment must be requested first")
        
        if not self.contract.has_sufficient_contract_balance(self.amount):
            raise ValueError("Insufficient contract balance")
        
        self.payment_status = 'approved'
        self.payment_approved_at = timezone.now()
        if notes:
            self.payment_notes += f"\n\nApproval notes: {notes}"
        self.save()
    
    def process_payment(self):
        """Process the actual payment transfer"""
        if self.payment_status != 'approved':
            raise ValueError("Payment must be approved first")
        
        from payments.models import Wallet, WalletTransaction
        
        # Use contract's transfer method
        result = self.contract.transfer_to_professional_balance(self.amount)
        
        # Update milestone status
        self.payment_status = 'paid'
        self.status = 'paid'
        self.payment_date = timezone.now().date()
        self.completion_date = timezone.now().date()
        self.save()
        
        return {
            'milestone_amount': self.amount,
            'net_amount': result['net_amount'],
            'commission_amount': result['commission_amount'],
            'release_date': result['release_date']
        }
    
    def accept_payment(self, notes=''):
        """Accept payment for this milestone (client accepts the work)"""
        if self.status != 'in_progress':
            return {'success': False, 'error': 'Milestone must be in progress to accept payment'}
        
        # Check if contract has sufficient contract balance
        if not self.contract.has_sufficient_contract_balance(self.amount):
            return {'success': False, 'error': 'Insufficient contract balance'}
        
        try:
            # Use contract's transfer method
            result = self.contract.transfer_to_professional_balance(self.amount)
            
            # Update milestone status
            self.status = 'completed'
            self.payment_status = 'paid'
            self.payment_date = timezone.now().date()
            self.completion_date = timezone.now().date()
            if notes:
                self.payment_notes += f"\n\nAcceptance notes: {notes}"
            self.save()
            
            return {
                'success': True,
                'milestone_amount': self.amount,
                'net_amount': result['net_amount'],
                'commission_amount': result['commission_amount'],
                'release_date': result['release_date']
            }
            
        except ValueError as e:
            return {'success': False, 'error': str(e)}
    
    def cancel_milestone(self, notes=''):
        """Cancel this milestone"""
        if self.status not in ['pending', 'in_progress']:
            return {'success': False, 'error': 'Can only cancel pending or in-progress milestones'}
        
        # Update milestone status
        self.status = 'cancelled'
        self.payment_status = 'rejected'
        if notes:
            self.payment_notes += f"\n\nCancellation notes: {notes}"
        self.save()
        
        return {'success': True, 'message': 'Milestone cancelled successfully'}


class ContractDocument(models.Model):
    """
    مستندات العقد
    """
    DOCUMENT_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
        ('change_order', 'Change Order'),
        ('other', 'Other'),
    ]
    
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    name = models.CharField(max_length=255)
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES,
        default='other'
    )
    file = models.FileField(upload_to='contracts/documents/')
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )
    is_signed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'contract_documents'
        verbose_name = 'Contract Document'
        verbose_name_plural = 'Contract Documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.contract.contract_number} - {self.name}"


class ContractLocation(models.Model):
    """
    مواقع العقد
    """
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='locations'
    )
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    is_primary = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contract_locations'
        verbose_name = 'Contract Location'
        verbose_name_plural = 'Contract Locations'
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"{self.contract.contract_number} - {self.name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one primary location per contract
        if self.is_primary:
            ContractLocation.objects.filter(
                contract=self.contract,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class ContractCalendarEvent(models.Model):
    """
    أحداث تقويم العقد (المواعيد)
    """
    EVENT_TYPE_CHOICES = [
        ('meeting', 'Meeting'),
        ('milestone', 'Milestone'),
        ('deadline', 'Deadline'),
        ('review', 'Review'),
        ('payment', 'Payment'),
        ('inspection', 'Inspection'),
        ('delivery', 'Delivery'),
        ('appointment', 'Appointment'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('postponed', 'Postponed'),
    ]
    
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='calendar_events'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPE_CHOICES,
        default='appointment'
    )
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_events'
    )
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contract_calendar_events'
        verbose_name = 'Contract Calendar Event'
        verbose_name_plural = 'Contract Calendar Events'
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['contract']),
            models.Index(fields=['date']),
            models.Index(fields=['event_type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.contract.contract_number} - {self.title}"
    
    @property
    def duration(self):
        """Calculate event duration in minutes"""
        if self.start_time and self.end_time:
            start_minutes = self.start_time.hour * 60 + self.start_time.minute
            end_minutes = self.end_time.hour * 60 + self.end_time.minute
            return end_minutes - start_minutes
        return 0


class ContractInstallment(models.Model):
    """Contract installment payments created by clients"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('transferred', 'Transferred'),
        ('cancelled', 'Cancelled'),
    ]
    
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='installments'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    transferred_at = models.DateTimeField(null=True, blank=True)
    
    # Financial tracking
    net_amount_to_professional = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    platform_commission_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    class Meta:
        db_table = 'contract_installments'
        verbose_name = 'Contract Installment'
        verbose_name_plural = 'Contract Installments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['contract']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Installment {self.id} - {self.contract.contract_number} - ${self.amount}"
    
    def confirm_installment(self):
        """Confirm installment and transfer funds to professional balance"""
        if self.status != 'pending':
            raise ValueError("Only pending installments can be confirmed")
        
        if not self.contract.has_sufficient_contract_balance(self.amount):
            raise ValueError("Insufficient contract balance for this installment")
        
        # Calculate commission
        commission_rate = self.contract.platform_commission_rate
        self.platform_commission_amount = self.amount * commission_rate
        self.net_amount_to_professional = self.amount - self.platform_commission_amount
        
        # Transfer funds using contract's method
        result = self.contract.transfer_to_professional_balance(self.amount)
        
        # Update installment status
        self.status = 'confirmed'
        self.confirmed_at = timezone.now()
        self.save()
        
        return {
            'installment_id': self.id,
            'amount': self.amount,
            'net_amount': self.net_amount_to_professional,
            'commission_amount': self.platform_commission_amount,
            'professional_balance_release_date': result['release_date']
        }
    
    def cancel_installment(self, reason=''):
        """Cancel pending installment and refund to client wallet"""
        if self.status != 'pending':
            raise ValueError("Only pending installments can be cancelled")
        
        from payments.models import Wallet, WalletTransaction
        
        # Get client wallet
        client_wallet = Wallet.objects.get(user=self.contract.client)
        
        # Release funds from pending balance back to available balance
        client_wallet.release_pending(self.amount)
        
        # Create wallet transaction record
        WalletTransaction.objects.create(
            wallet=client_wallet,
            transaction_type='installment_refund',
            amount=self.amount,
            description=f'Refund for cancelled installment - Contract {self.contract.contract_number}',
            related_contract=self.contract
        )
        
        # Deduct from contract balance
        self.contract.contract_balance -= self.amount
        self.contract.save()
        
        # Update installment status
        self.status = 'cancelled'
        self.description = f"{self.description}\nCancelled: {reason}" if reason else f"{self.description}\nCancelled"
        self.save()
        
        return {
            'success': True, 
            'message': 'Installment cancelled and funds refunded successfully',
            'refunded_amount': self.amount
        }
