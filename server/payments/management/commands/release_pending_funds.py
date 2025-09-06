from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from payments.models import Wallet, WalletTransaction
from django.db import transaction


class Command(BaseCommand):
    help = 'Release pending funds that have been held for more than 3 days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-id',
            type=int,
            help='Release pending funds for a specific user ID',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be released without actually doing it',
        )

    def handle(self, *args, **options):
        user_id = options.get('user_id')
        dry_run = options.get('dry_run', False)
        
        # Calculate the cutoff date (3 days ago)
        cutoff_date = timezone.now() - timedelta(days=3)
        
        # Base query for pending transactions older than 3 days
        pending_transactions = WalletTransaction.objects.filter(
            created_at__lt=cutoff_date,
            description__icontains='pending'
        ).exclude(
            description__icontains='released'
        )
        
        # Filter by user if specified
        if user_id:
            pending_transactions = pending_transactions.filter(wallet__user_id=user_id)
            
        if not pending_transactions.exists():
            self.stdout.write(
                self.style.WARNING('No pending funds found to release.')
            )
            return
            
        total_released = 0
        users_affected = set()
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN MODE - No actual changes will be made')
            )
            
        for transaction in pending_transactions:
            wallet = transaction.wallet
            amount = transaction.amount
            
            if dry_run:
                self.stdout.write(
                    f'Would release ${amount} for user {wallet.user.username} '
                    f'(Transaction ID: {transaction.id})'
                )
                total_released += amount
                users_affected.add(wallet.user.username)
                continue
                
            try:
                with transaction.atomic():
                    # Move funds from pending to available
                    if wallet.pending_balance >= amount:
                        wallet.pending_balance -= amount
                        wallet.available_balance += amount
                        wallet.save()
                        
                        # Update transaction description to mark as released
                        transaction.description = f"{transaction.description} - Released on {timezone.now().date()}"
                        transaction.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Released ${amount} for user {wallet.user.username} '
                                f'(Transaction ID: {transaction.id})'
                            )
                        )
                        
                        total_released += amount
                        users_affected.add(wallet.user.username)
                    else:
                        self.stdout.write(
                            self.style.ERROR(
                                f'Insufficient pending balance for user {wallet.user.username}. '
                                f'Required: ${amount}, Available: ${wallet.pending_balance}'
                            )
                        )
                        
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error releasing funds for user {wallet.user.username}: {str(e)}'
                    )
                )
                
        # Summary
        action = 'Would release' if dry_run else 'Released'
        self.stdout.write(
            self.style.SUCCESS(
                f'\n{action} ${total_released} total for {len(users_affected)} users.'
            )
        )
        
        if users_affected:
            self.stdout.write(
                f'Users affected: {", ".join(sorted(users_affected))}'
            )