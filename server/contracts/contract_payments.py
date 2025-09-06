from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()


class ContractPayment(models.Model):
    """
    Direct payments from Contract Balance to Professional
    This replaces the milestone/installment system with direct contract-based payments
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Client Approval'),
        ('approved', 'Approved by Client'),
        ('transferred', 'Transferred to Professional'),
        ('completed', 'Completed (Available to Professional)'),
        ('cancelled', 'Cancelled'),
        ('disputed', 'Disputed'),
    ]
    
    # Basic Info
    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    contract = models.ForeignKey(
        'Contract',
        on_delete=models.CASCADE,
        related_name='contract_payments'
    )
    
    # Payment Details
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Gross payment amount requested"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of work completed or payment reason"
    )
    
    # Commission and Net Calculations
    platform_commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        default=0.15,  # 15%
        validators=[MinValueValidator(0)]
    )
    platform_commission_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    net_amount_to_professional = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Amount transferred to professional after commission"
    )
    
    # Status and Timing
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    transferred_at = models.DateTimeField(null=True, blank=True)
    available_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When funds become available to professional (3 days after transfer)"
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Info
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='requested_payments',
        help_text="Professional who requested the payment"
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_payments',
        help_text="Client who approved the payment"
    )
    
    notes = models.TextField(blank=True)
    client_notes = models.TextField(
        blank=True,
        help_text="Notes from client when approving/rejecting"
    )
    
    class Meta:
        db_table = 'contract_payments'
        verbose_name = 'Contract Payment'
        verbose_name_plural = 'Contract Payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['contract']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['available_at']),
        ]
    
    def __str__(self):
        return f"Payment {self.payment_id} - {self.contract.contract_number} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        # Calculate commission and net amount
        if self.amount:
            commission_rate = Decimal(str(self.platform_commission_rate))
            self.platform_commission_amount = self.amount * commission_rate
            self.net_amount_to_professional = self.amount - self.platform_commission_amount
        super().save(*args, **kwargs)
    
    @property
    def is_available_to_professional(self):
        """Check if funds are available to professional (after 3-day hold)"""
        if self.available_at and self.status == 'transferred':
            return timezone.now() >= self.available_at
        return False
    
    def request_payment(self, requested_by, description='', notes=''):
        """Professional requests payment from contract balance"""
        if self.status != 'pending':
            raise ValueError("Payment can only be requested when in pending status")
        
        # Check if contract has sufficient balance
        if not self.contract.has_sufficient_contract_balance(self.amount):
            raise ValueError("Insufficient contract balance")
        
        self.requested_by = requested_by
        self.description = description
        self.notes = notes
        self.save()
        
        return {
            'success': True,
            'message': 'Payment request submitted successfully',
            'payment_id': str(self.payment_id)
        }
    
    def approve_payment(self, approved_by, client_notes=''):
        """Client approves the payment request"""
        if self.status != 'pending':
            raise ValueError("Only pending payments can be approved")
        
        # Verify approver is the contract client
        if approved_by != self.contract.client:
            raise ValueError("Only the contract client can approve payments")
        
        # Check contract balance again
        if not self.contract.has_sufficient_contract_balance(self.amount):
            raise ValueError("Insufficient contract balance")
        
        # Update status and timestamps
        self.status = 'approved'
        self.approved_by = approved_by
        self.approved_at = timezone.now()
        self.client_notes = client_notes
        self.save()
        
        # Process the payment transfer
        return self._process_payment_transfer()
    
    def _process_payment_transfer(self):
        """Internal method to process the actual payment transfer"""
        from payments.models import Wallet, WalletTransaction
        
        try:
            # Deduct from contract balance
            self.contract.contract_balance -= self.amount
            self.contract.paid_amount += self.amount
            self.contract.save()
            
            # Deduct from client's pending balance
            client_wallet, created = Wallet.objects.get_or_create(user=self.contract.client)
            if client_wallet.pending_balance >= self.amount:
                client_wallet.pending_balance -= self.amount
                client_wallet.save()
                
                # Create client transaction record
                WalletTransaction.objects.create(
                    wallet=client_wallet,
                    amount=-self.amount,
                    transaction_type='debit',
                    source='contract_payment',
                    description=f'Payment to {self.contract.professional.get_full_name()} for contract {self.contract.contract_number}'
                )
            else:
                raise ValueError("Insufficient client pending balance")
            
            # Add to professional's pending balance (with 3-day hold)
            professional_wallet, created = Wallet.objects.get_or_create(user=self.contract.professional)
            professional_wallet.pending_balance += self.net_amount_to_professional
            professional_wallet.save()
            
            # Create professional transaction record
            WalletTransaction.objects.create(
                wallet=professional_wallet,
                amount=self.net_amount_to_professional,
                transaction_type='credit',
                source='contract_payment',
                description=f'Payment from {self.contract.client.get_full_name()} for contract {self.contract.contract_number} (3-day hold)'
            )
            
            # Update payment status and timing
            self.status = 'transferred'
            self.transferred_at = timezone.now()
            self.available_at = timezone.now() + timezone.timedelta(days=3)
            self.save()
            
            return {
                'success': True,
                'message': 'Payment transferred successfully',
                'gross_amount': self.amount,
                'net_amount': self.net_amount_to_professional,
                'commission_amount': self.platform_commission_amount,
                'available_date': self.available_at
            }
            
        except Exception as e:
            # Rollback any changes if something goes wrong
            self.status = 'approved'  # Keep as approved for retry
            self.save()
            raise e
    
    def cancel_payment(self, cancelled_by, reason=''):
        """Cancel the payment request"""
        if self.status not in ['pending', 'approved']:
            raise ValueError("Only pending or approved payments can be cancelled")
        
        # If payment was already transferred, we need to refund
        if self.status == 'transferred':
            return self._refund_payment(reason)
        
        self.status = 'cancelled'
        self.client_notes = reason
        self.save()
        
        return {
            'success': True,
            'message': 'Payment cancelled successfully'
        }
    
    def _refund_payment(self, reason=''):
        """Refund a transferred payment"""
        from payments.models import Wallet, WalletTransaction
        
        try:
            # Add back to contract balance
            self.contract.contract_balance += self.amount
            self.contract.paid_amount -= self.amount
            self.contract.save()
            
            # Add back to client's pending balance
            client_wallet = Wallet.objects.get(user=self.contract.client)
            client_wallet.pending_balance += self.amount
            client_wallet.save()
            
            # Create client refund transaction
            WalletTransaction.objects.create(
                wallet=client_wallet,
                amount=self.amount,
                transaction_type='credit',
                source='payment_refund',
                description=f'Refund for cancelled payment to {self.contract.professional.get_full_name()}'
            )
            
            # Deduct from professional's pending balance
            professional_wallet = Wallet.objects.get(user=self.contract.professional)
            if professional_wallet.pending_balance >= self.net_amount_to_professional:
                professional_wallet.pending_balance -= self.net_amount_to_professional
                professional_wallet.save()
                
                # Create professional refund transaction
                WalletTransaction.objects.create(
                    wallet=professional_wallet,
                    amount=-self.net_amount_to_professional,
                    transaction_type='debit',
                    source='payment_refund',
                    description=f'Refund of cancelled payment from {self.contract.client.get_full_name()}'
                )
            
            self.status = 'cancelled'
            self.client_notes = reason
            self.save()
            
            return {
                'success': True,
                'message': 'Payment refunded successfully'
            }
            
        except Exception as e:
            raise e
    
    def complete_payment(self):
        """Complete payment by moving funds from pending to available (after 3-day hold)"""
        if self.status != 'transferred':
            raise ValueError("Only transferred payments can be completed")
        
        if not self.is_available_to_professional:
            raise ValueError("Payment is not yet available (3-day hold period)")
        
        from payments.models import Wallet, WalletTransaction
        
        # Move from professional's pending to available balance
        professional_wallet = Wallet.objects.get(user=self.contract.professional)
        
        if professional_wallet.pending_balance >= self.net_amount_to_professional:
            professional_wallet.pending_balance -= self.net_amount_to_professional
            professional_wallet.available_balance += self.net_amount_to_professional
            professional_wallet.total_earned += self.net_amount_to_professional
            professional_wallet.save()
            
            # Create transaction record
            WalletTransaction.objects.create(
                wallet=professional_wallet,
                amount=self.net_amount_to_professional,
                transaction_type='credit',
                source='balance_release',
                description=f'Payment available from contract {self.contract.contract_number}'
            )
            
            self.status = 'completed'
            self.completed_at = timezone.now()
            self.save()
            
            return {
                'success': True,
                'message': 'Payment completed successfully',
                'amount': self.net_amount_to_professional
            }
        else:
            raise ValueError("Insufficient pending balance for completion")