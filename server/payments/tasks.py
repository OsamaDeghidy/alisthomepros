from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Wallet, WalletTransaction
import logging

logger = logging.getLogger(__name__)


@shared_task
def auto_release_pending_funds():
    """
    مهمة مجدولة للإفراج التلقائي عن الأموال المعلقة بعد 3 أيام
    تعمل كل ساعة للتحقق من المعاملات المؤهلة للإفراج
    """
    try:
        # Find transactions that are older than 3 days and still pending
        three_days_ago = timezone.now() - timedelta(days=3)
        
        pending_transactions = WalletTransaction.objects.filter(
            transaction_type='credit',
            source='milestone_payment',
            created_at__lte=three_days_ago,
            description__contains='3-day hold period'
        )
        
        total_released = 0
        released_count = 0
        affected_wallets = set()
        
        for transaction in pending_transactions:
            wallet = transaction.wallet
            
            # Move from pending to available balance
            wallet.pending_balance -= transaction.amount
            wallet.available_balance += transaction.amount
            total_released += transaction.amount
            released_count += 1
            affected_wallets.add(wallet)
            
            # Update transaction description to mark as released
            transaction.description = transaction.description.replace(
                '(3-day hold period)', 
                '(auto-released to available balance)'
            )
            transaction.save()
            
            logger.info(
                f'Auto-released ${transaction.amount} for user {wallet.user.id} '
                f'from transaction {transaction.id}'
            )
        
        # Save all affected wallets
        for wallet in affected_wallets:
            wallet.save()
        
        logger.info(
            f'Auto-release task completed: {released_count} transactions, '
            f'${total_released} total amount released'
        )
        
        return {
            'success': True,
            'transactions_released': released_count,
            'total_amount_released': float(total_released),
            'affected_wallets': len(affected_wallets)
        }
        
    except Exception as e:
        logger.error(f'Auto-release task failed: {str(e)}')
        return {
            'success': False,
            'error': str(e)
        }


@shared_task
def release_specific_user_funds(user_id):
    """
    إفراج عن الأموال المعلقة لمستخدم محدد
    """
    try:
        wallet = Wallet.objects.get(user_id=user_id)
        three_days_ago = timezone.now() - timedelta(days=3)
        
        pending_transactions = WalletTransaction.objects.filter(
            wallet=wallet,
            transaction_type='credit',
            source='milestone_payment',
            created_at__lte=three_days_ago,
            description__contains='3-day hold period'
        )
        
        total_released = 0
        released_count = 0
        
        for transaction in pending_transactions:
            wallet.pending_balance -= transaction.amount
            wallet.available_balance += transaction.amount
            total_released += transaction.amount
            released_count += 1
            
            transaction.description = transaction.description.replace(
                '(3-day hold period)', 
                '(manually released to available balance)'
            )
            transaction.save()
        
        wallet.save()
        
        logger.info(
            f'Manual release for user {user_id}: {released_count} transactions, '
            f'${total_released} total amount'
        )
        
        return {
            'success': True,
            'user_id': user_id,
            'transactions_released': released_count,
            'total_amount_released': float(total_released)
        }
        
    except Wallet.DoesNotExist:
        logger.error(f'Wallet not found for user {user_id}')
        return {
            'success': False,
            'error': f'Wallet not found for user {user_id}'
        }
    except Exception as e:
        logger.error(f'Manual release failed for user {user_id}: {str(e)}')
        return {
            'success': False,
            'error': str(e)
        }