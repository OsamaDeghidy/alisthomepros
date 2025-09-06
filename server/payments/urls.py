from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # Payment methods
    path('methods/', views.PaymentMethodListView.as_view(), name='payment_method_list'),
    path('methods/create/', views.PaymentMethodCreateView.as_view(), name='create_payment_method'),
    path('methods/authorize-net/add/', views.add_authorize_net_payment_method, name='add_authorize_net_payment_method'),
    path('methods/<int:pk>/update/', views.PaymentMethodUpdateView.as_view(), name='update_payment_method'),
    path('methods/<int:pk>/delete/', views.PaymentMethodDeleteView.as_view(), name='delete_payment_method'),
    path('methods/<int:method_id>/set-default/', views.set_default_payment_method, name='set_default_payment_method'),
    
    # Payments
    path('', views.PaymentListView.as_view(), name='payment_list'),
    path('<int:pk>/', views.PaymentDetailView.as_view(), name='payment_detail'),
    path('create/', views.PaymentCreateView.as_view(), name='create_payment'),
    path('process/', views.PaymentProcessView.as_view(), name='process_payment'),
    
    # Milestone payments
    path('milestones/<int:milestone_id>/request/', views.MilestonePaymentRequestView.as_view(), name='milestone-payment-request'),
    path('milestones/<int:milestone_id>/approve/', views.MilestonePaymentApprovalView.as_view(), name='milestone-payment-approve'),
    path('milestone-requests/', views.PendingMilestonePaymentsView.as_view(), name='pending-milestone-payments'),
    
    # Analytics and stats
    path('stats/', views.payment_stats, name='payment_stats'),
    path('summary/', views.payment_summary, name='payment_summary'),
    path('analytics/', views.payment_analytics, name='payment_analytics'),
    
    # Wallet endpoints
    path('wallet/', views.WalletDetailView.as_view(), name='wallet_detail'),
    path('wallet/transactions/', views.WalletTransactionListView.as_view(), name='wallet_transactions'),
    path('wallet/topup/', views.wallet_topup, name='wallet_topup'),
    path('wallet/stats/', views.wallet_stats, name='wallet_stats'),
    path('wallet/pending-transactions/', views.pending_transactions_with_release_dates, name='pending_transactions_with_release_dates'),
    
    # Withdrawal endpoints
    path('withdrawals/', views.WithdrawalListView.as_view(), name='withdrawal_list'),
    path('withdrawals/create/', views.WithdrawalCreateView.as_view(), name='create_withdrawal'),
    path('withdrawals/<int:pk>/', views.WithdrawalDetailView.as_view(), name='withdrawal_detail'),
    
    # Bank account endpoints
    path('bank-accounts/', views.BankAccountListView.as_view(), name='bank_account_list'),
    path('bank-accounts/create/', views.BankAccountCreateView.as_view(), name='create_bank_account'),
    path('bank-accounts/<int:pk>/', views.BankAccountDetailView.as_view(), name='bank_account_detail'),
    path('bank-accounts/<int:pk>/verify/', views.verify_bank_account, name='verify_bank_account'),
]