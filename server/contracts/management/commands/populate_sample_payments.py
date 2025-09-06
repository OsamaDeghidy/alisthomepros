from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from contracts.models import Contract
from contracts.contract_payments import ContractPayment
from payments.models import Wallet
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate sample payment data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--contract-id',
            type=int,
            help='Specific contract ID to add payments to',
        )
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Number of sample payments to create',
        )

    def handle(self, *args, **options):
        contract_id = options.get('contract_id')
        count = options.get('count', 5)

        if contract_id:
            try:
                contract = Contract.objects.get(id=contract_id)
                contracts = [contract]
            except Contract.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Contract with ID {contract_id} does not exist')
                )
                return
        else:
            contracts = Contract.objects.filter(status='active')[:3]

        if not contracts:
            self.stdout.write(
                self.style.ERROR('No active contracts found')
            )
            return

        payment_descriptions = [
            'Initial project setup and planning',
            'Frontend development milestone',
            'Backend API development',
            'Database design and implementation',
            'UI/UX design completion',
            'Testing and quality assurance',
            'Bug fixes and optimization',
            'Final project delivery',
            'Additional feature implementation',
            'Project maintenance and support'
        ]

        total_created = 0

        for contract in contracts:
            # Ensure contract has some balance
            if contract.contract_balance <= 0:
                contract.contract_balance = Decimal('5000.00')
                contract.save()
                self.stdout.write(
                    self.style.WARNING(
                        f'Added balance to contract {contract.id}: {contract.contract_balance}'
                    )
                )

            # Ensure wallets exist
            client_wallet, _ = Wallet.objects.get_or_create(
                user=contract.client,
                defaults={'available_balance': Decimal('10000.00')}
            )
            professional_wallet, _ = Wallet.objects.get_or_create(
                user=contract.professional,
                defaults={'available_balance': Decimal('1000.00')}
            )

            # Create sample payments
            payments_for_contract = min(count, len(payment_descriptions))
            
            for i in range(payments_for_contract):
                # Random amount between 100 and 1000
                amount = Decimal(str(random.randint(100, 1000)))
                
                # Ensure amount doesn't exceed contract balance
                if amount > contract.contract_balance:
                    amount = contract.contract_balance * Decimal('0.5')

                description = payment_descriptions[i]
                
                # Create payment with different statuses
                status_options = ['pending'] * 4 + ['approved'] * 3 + ['completed'] * 3
                status = random.choice(status_options)

                try:
                    payment = ContractPayment.objects.create(
                        contract=contract,
                        amount=amount,
                        description=description,
                        status=status,
                        requested_by=contract.professional
                    )

                    # If approved or completed, set approved_by
                    if status in ['approved', 'completed']:
                        payment.approved_by = contract.client
                        payment.save()

                    total_created += 1
                    
                    self.stdout.write(
                        f'Created payment: {payment.payment_id} - {amount} ({status})'
                    )

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error creating payment: {str(e)}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {total_created} sample payments'
            )
        )

        # Update contract balances and paid amounts
        for contract in contracts:
            completed_payments = ContractPayment.objects.filter(
                contract=contract,
                status='completed'
            )
            total_paid = sum(p.amount for p in completed_payments)
            
            contract.paid_amount = total_paid
            contract.save()
            
            self.stdout.write(
                f'Updated contract {contract.id}: paid_amount = {total_paid}'
            )