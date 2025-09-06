from django.urls import path
from .views import (
    proposal_list, project_proposals, create_proposal,
    proposal_detail, accept_proposal, reject_proposal,
    create_contract_from_proposal_custom, professional_proposals
)

urlpatterns = [
    # Proposal endpoints
    path('', proposal_list, name='proposal-list'),
    path('create/', create_proposal, name='proposal-create'),
    path('<uuid:proposal_id>/', proposal_detail, name='proposal-detail'),
    path('<uuid:proposal_id>/accept/', accept_proposal, name='proposal-accept'),
    path('<uuid:proposal_id>/reject/', reject_proposal, name='proposal-reject'),
    path('<uuid:proposal_id>/create-contract/', create_contract_from_proposal_custom, name='proposal-create-contract'),
    
    # Project-specific proposals
    path('project/<int:project_id>/', project_proposals, name='project-proposals'),
    path('professional/', professional_proposals, name='professional-proposals'),
]