from django.urls import path
from .views import (
    DisputeListView, DisputeCreateView, DisputeDetailView, DisputeUpdateView,
    DisputeMessageListView, DisputeEvidenceListView, DisputeStatsView,
    resolve_dispute, escalate_dispute, close_dispute, assign_dispute
)

urlpatterns = [
    # Dispute CRUD operations
    path('', DisputeListView.as_view(), name='dispute-list'),
    path('create/', DisputeCreateView.as_view(), name='dispute-create'),
    path('<uuid:dispute_id>/', DisputeDetailView.as_view(), name='dispute-detail'),
    path('<uuid:dispute_id>/update/', DisputeUpdateView.as_view(), name='dispute-update'),
    
    # Dispute actions
    path('<uuid:dispute_id>/resolve/', resolve_dispute, name='dispute-resolve'),
    path('<uuid:dispute_id>/escalate/', escalate_dispute, name='dispute-escalate'),
    path('<uuid:dispute_id>/close/', close_dispute, name='dispute-close'),
    path('<uuid:dispute_id>/assign/', assign_dispute, name='dispute-assign'),
    
    # Dispute messages
    path('<uuid:dispute_id>/messages/', DisputeMessageListView.as_view(), name='dispute-messages'),
    
    # Dispute evidence
    path('<uuid:dispute_id>/evidence/', DisputeEvidenceListView.as_view(), name='dispute-evidence'),
    
    # Statistics
    path('stats/', DisputeStatsView.as_view(), name='dispute-stats'),
]