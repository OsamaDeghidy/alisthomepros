from django.urls import path
from . import views
from . import payment_views

app_name = 'contracts'

urlpatterns = [
    # Contract management
    path('', views.ContractListView.as_view(), name='contract_list'),
    path('stats/', views.ContractStatsView.as_view(), name='contract_stats'),
    path('<int:pk>/', views.ContractDetailView.as_view(), name='contract_detail'),
    path('create/', views.ContractCreateView.as_view(), name='contract_create'),
    path('<int:pk>/update/', views.ContractUpdateView.as_view(), name='contract_update'),
    
    # Contract actions
    path('<int:pk>/sign/', views.ContractSignView.as_view(), name='contract_sign'),
    path('<int:pk>/terminate/', views.ContractTerminateView.as_view(), name='contract_terminate'),
    path('<int:pk>/allocate-funds/', views.ContractAllocateFundsView.as_view(), name='contract_allocate_funds'),
    path('<int:pk>/complete/', views.ContractCompleteView.as_view(), name='contract_complete'),
    path('<int:pk>/dispute/', views.ContractDisputeView.as_view(), name='contract_dispute'),
    path('<int:pk>/milestones/', views.ContractMilestoneListView.as_view(), name='milestone_list'),
    path('<int:pk>/documents/', views.ContractDocumentListView.as_view(), name='document_list'),
    
    # Milestone payment actions
    path('<int:pk>/milestones/<int:milestone_id>/request-payment/', views.MilestoneRequestPaymentView.as_view(), name='milestone_request_payment'),
    path('<int:pk>/milestones/<int:milestone_id>/approve-payment/', views.MilestoneApprovePaymentView.as_view(), name='milestone_approve_payment'),
    path('<int:pk>/milestones/<int:milestone_id>/process-payment/', views.MilestoneProcessPaymentView.as_view(), name='milestone_process_payment'),
    path('<int:pk>/milestones/<int:milestone_id>/reject-payment/', views.MilestoneRejectPaymentView.as_view(), name='milestone_reject_payment'),
    path('<int:pk>/milestones/<int:milestone_id>/accept-payment/', views.MilestoneAcceptPaymentView.as_view(), name='milestone_accept_payment'),
    path('<int:pk>/milestones/<int:milestone_id>/cancel/', views.MilestoneCancelView.as_view(), name='milestone_cancel'),
    
    # Payment reports
    path('payment-reports/export/', views.PaymentReportExportView.as_view(), name='payment_report_export'),
    
    # Payment management
    path('release-pending-funds/', views.ReleasePendingFundsView.as_view(), name='release_pending_funds'),
    
    # Contract amendments (now appointments)
    path('<int:pk>/amendments/', views.ContractAmendmentListView.as_view(), name='amendment_list'),
    
    # Contract locations
    path('<int:pk>/locations/', views.ContractLocationListView.as_view(), name='location_list'),
    
    # Contract calendar events (appointments)
    path('<int:pk>/calendar-events/', views.ContractCalendarEventListView.as_view(), name='calendar_event_list'),
    
    # Individual contract location operations
    path('locations/<int:pk>/', views.ContractLocationDetailView.as_view(), name='location_detail'),
    path('locations/<int:pk>/update/', views.ContractLocationUpdateView.as_view(), name='location_update'),
    path('locations/<int:pk>/delete/', views.ContractLocationDeleteView.as_view(), name='location_delete'),
    path('locations/<int:pk>/set_primary/', views.ContractLocationSetPrimaryView.as_view(), name='location_set_primary'),
    
    # Work receipt confirmation and dispute management
    path('confirm-work-receipt/', views.ConfirmWorkReceiptView.as_view(), name='confirm_work_receipt'),
    path('raise-dispute/', views.RaiseDisputeView.as_view(), name='raise_dispute'),
    
    # Client contracts
    path('client/', views.ClientContractListView.as_view(), name='client_contracts'),
    
    # Professional contracts
    path('professional/', views.ProfessionalContractListView.as_view(), name='professional_contracts'),
    
    # Installments
    path('<int:pk>/installments/', views.ContractInstallmentListView.as_view(), name='installment_list'),
    path('<int:pk>/installments/<uuid:installment_id>/confirm/', views.ContractInstallmentConfirmView.as_view(), name='installment_confirm'),
    path('<int:pk>/installments/<uuid:installment_id>/cancel/', views.ContractInstallmentCancelView.as_view(), name='installment_cancel'),
    
    # Contract Payments (New System)
    path('<int:pk>/payments/', payment_views.ContractPaymentListView.as_view(), name='contract_payments'),
    path('<int:pk>/payments/<int:payment_id>/', payment_views.ContractPaymentDetailView.as_view(), name='contract_payment_detail'),
    path('<int:pk>/payments/<int:payment_id>/approve/', payment_views.approve_payment, name='contract_payment_approve'),
    path('<int:pk>/payments/<int:payment_id>/cancel/', payment_views.cancel_payment, name='contract_payment_cancel'),
    
    # Contract Balance Management
    path('<int:contract_id>/balance/', payment_views.contract_balance_info, name='contract_balance'),
    path('<int:contract_id>/allocate-balance/', payment_views.allocate_funds_to_contract, name='contract_allocate_balance'),
    
    # Professional Payment Management
    path('professional/pending-payments/', payment_views.professional_pending_payments, name='professional_pending_payments'),
    path('professional/available-payments/', payment_views.complete_available_payments, name='professional_available_payments'),
]