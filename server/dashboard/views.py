from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    DashboardStats, DashboardNotification, QuickAction, 
    DashboardAnalytics, PerformanceMetrics, PendingAction
)
from .serializers import (
    ProfessionalDashboardSerializer, ClientDashboardSerializer,
    DashboardStatsSerializer, DashboardNotificationSerializer,
    QuickActionSerializer, PerformanceMetricsSerializer,
    PendingActionSerializer
)
from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from payments.models import Payment
from messaging.models import Message, Conversation
from reviews.models import Review
import json
import traceback

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def professional_dashboard(request):
    """Get professional dashboard data"""
    try:
        print(f"🔍 Professional dashboard request for user: {request.user.email}")
        
        user = request.user
        
        # Get or create dashboard stats
        stats, created = DashboardStats.objects.get_or_create(user=user)
        
        # Calculate stats from actual data
        active_contracts = Contract.objects.filter(professional=user, status__in=['active', 'in_progress'])
        completed_contracts = Contract.objects.filter(professional=user, status='completed')
        proposals = Proposal.objects.filter(professional=user)
        
        # Update stats
        stats.active_jobs = active_contracts.count()
        stats.completed_jobs = completed_contracts.count()
        stats.proposals_sent = proposals.count()
        
        # Calculate earnings
        total_earned = sum([contract.total_amount for contract in completed_contracts])
        stats.total_earned = total_earned
        
        # Calculate success rate
        if proposals.count() > 0:
            accepted_proposals = proposals.filter(status='accepted').count()
            stats.success_rate = (accepted_proposals / proposals.count()) * 100
        else:
            stats.success_rate = 0
            
        # Calculate monthly earnings
        current_month = timezone.now().month
        monthly_contracts = completed_contracts.filter(created_at__month=current_month)
        stats.monthly_earnings = sum([contract.total_amount for contract in monthly_contracts])
        
        # Calculate weekly earnings
        week_ago = timezone.now() - timedelta(days=7)
        weekly_contracts = completed_contracts.filter(created_at__gte=week_ago)
        stats.weekly_earnings = sum([contract.total_amount for contract in weekly_contracts])
        
        # Calculate jobs this month
        stats.jobs_this_month = active_contracts.filter(created_at__month=current_month).count()
        
        # Calculate proposals this month
        stats.proposals_this_month = proposals.filter(created_at__month=current_month).count()
        
        # Calculate average rating
        reviews = Review.objects.filter(reviewee=user)
        if reviews.exists():
            stats.average_rating = sum([review.rating for review in reviews]) / reviews.count()
        else:
            stats.average_rating = 0
            
        # Calculate total clients
        stats.total_clients = active_contracts.values('client').distinct().count()
        
        # Calculate pending payments
        stats.pending_payments = Payment.objects.filter(
            contract__professional=user, 
            status='pending'
        ).count()
        
        stats.save()
        
        # Get active jobs (contracts)
        active_jobs = []
        for contract in active_contracts[:5]:  # Limit to 5
            try:
                active_jobs.append({
                    'id': contract.id,
                    'title': contract.title,
                    'client': {
                        'id': contract.client.id,
                        'first_name': contract.client.first_name,
                        'last_name': contract.client.last_name,
                        'email': contract.client.email,
                        'avatar': contract.client.avatar.url if contract.client.avatar else None
                    },
                    'status': contract.status,
                    'progress': contract.completion_percentage or 0,
                    'budget': contract.total_amount,
                    'deadline': contract.end_date,
                    'location': contract.project.location if contract.project else 'N/A',
                    'category': contract.project.category.name if contract.project and contract.project.category else 'N/A',
                    'priority': 'medium',  # Default priority
                    'last_update': contract.updated_at,
                    'contract_type': contract.payment_type,
                    'created_at': contract.created_at,
                    'updated_at': contract.updated_at
                })
            except Exception as e:
                print(f"❌ Error processing contract {contract.id}: {e}")
                continue
        
        # Get new jobs (projects)
        new_jobs = []
        try:
            recent_projects = Project.objects.filter(
                status='open',
                created_at__gte=timezone.now() - timedelta(days=30)
            ).exclude(
                proposals__professional=user
            )[:5]
            
            for project in recent_projects:
                try:
                    proposals_count = project.proposals.count()
                    new_jobs.append({
                        'id': project.id,
                        'title': project.title,
                        'client': {
                            'id': project.client.id,
                            'first_name': project.client.first_name,
                            'last_name': project.client.last_name,
                            'email': project.client.email,
                            'avatar': project.client.avatar.url if project.client.avatar else None
                        },
                        'budget_min': project.budget_min,
                        'budget_max': project.budget_max,
                        'location': project.location,
                        'category': project.category.name if project.category else 'N/A',
                        'posted_time': project.created_at,
                        'proposals_count': proposals_count,
                        'time_left': '5 days',  # Placeholder
                        'verified': True,  # Placeholder
                        'urgent': project.urgent,
                        'description': project.description,
                        'created_at': project.created_at
                    })
                except Exception as e:
                    print(f"❌ Error processing project {project.id}: {e}")
                    continue
        except Exception as e:
            print(f"❌ Error getting new jobs: {e}")
        
        # Get recent messages
        recent_messages = []
        try:
            user_conversations = Conversation.objects.filter(participants=user)
            for conversation in user_conversations[:3]:
                last_message = conversation.messages.last()
                if last_message and last_message.sender != user:
                    try:
                        recent_messages.append({
                            'id': last_message.id,
                            'from': {
                                'id': last_message.sender.id,
                                'first_name': last_message.sender.first_name,
                                'last_name': last_message.sender.last_name,
                                'email': last_message.sender.email,
                                'avatar': last_message.sender.avatar.url if last_message.sender.avatar else None
                            },
                            'message': last_message.content[:100] + '...' if len(last_message.content) > 100 else last_message.content,
                            'time': last_message.created_at,
                            'unread': not last_message.read_by.filter(id=user.id).exists(),
                            'project': {
                                'id': conversation.project.id if conversation.project else 0,
                                'title': conversation.project.title if conversation.project else 'General'
                            },
                            'created_at': last_message.created_at
                        })
                    except Exception as e:
                        print(f"❌ Error processing message {last_message.id}: {e}")
                        continue
        except Exception as e:
            print(f"❌ Error getting recent messages: {e}")
        
        # Get recent earnings
        recent_earnings = []
        try:
            recent_payments = Payment.objects.filter(
                contract__professional=user,
                status='completed'
            ).order_by('-created_at')[:5]
            
            for payment in recent_payments:
                try:
                    recent_earnings.append({
                        'id': payment.id,
                        'project': {
                            'id': payment.contract.project.id if payment.contract.project else 0,
                            'title': payment.contract.project.title if payment.contract.project else 'N/A'
                        },
                        'client': {
                            'id': payment.contract.client.id,
                            'first_name': payment.contract.client.first_name,
                            'last_name': payment.contract.client.last_name,
                            'email': payment.contract.client.email
                        },
                        'amount': payment.amount,
                        'date': payment.created_at.date(),
                        'status': payment.status,
                        'type': payment.payment_type,
                        'created_at': payment.created_at
                    })
                except Exception as e:
                    print(f"❌ Error processing payment {payment.id}: {e}")
                    continue
        except Exception as e:
            print(f"❌ Error getting recent earnings: {e}")
        
        # Create analytics data
        analytics = {
            'earnings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]
            },
            'jobs_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]
            },
            'proposals_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]
            },
            'ratings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]
            }
        }
        
        # Create response data
        response_data = {
            'stats': {
                'active_jobs': stats.active_jobs,
                'total_earned': float(stats.total_earned),
                'proposals_sent': stats.proposals_sent,
                'success_rate': float(stats.success_rate),
                'completed_jobs': stats.completed_jobs,
                'pending_payments': stats.pending_payments,
                'average_rating': float(stats.average_rating),
                'total_clients': stats.total_clients,
                'monthly_earnings': float(stats.monthly_earnings),
                'weekly_earnings': float(stats.weekly_earnings),
                'jobs_this_month': stats.jobs_this_month,
                'proposals_this_month': stats.proposals_this_month
            },
            'active_jobs': active_jobs,
            'new_jobs': new_jobs,
            'recent_messages': recent_messages,
            'recent_earnings': recent_earnings,
            'analytics': analytics
        }
        
        print(f"✅ Professional dashboard data prepared successfully")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error in professional_dashboard: {e}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Internal server error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_dashboard(request):
    """Get client dashboard data"""
    print("🚀 CLIENT DASHBOARD VIEW CALLED!")
    print(f"🔍 Request method: {request.method}")
    print(f"🔍 Request path: {request.path}")
    try:
        user = request.user
        print(f"🔍 Client dashboard request for user: {user.email}")
        
        # Get or create dashboard stats
        stats, created = DashboardStats.objects.get_or_create(user=user)
        
        # Calculate stats from actual data
        client_projects = Project.objects.filter(client=user)
        active_projects = client_projects.filter(status='in_progress')
        completed_projects = client_projects.filter(status='completed')
        client_contracts = Contract.objects.filter(client=user)
        
        # Update stats
        stats.active_jobs = active_projects.count()
        stats.completed_jobs = completed_projects.count()
        stats.total_earned = sum([contract.total_amount for contract in client_contracts])
        stats.total_clients = 1  # Client has only themselves
        
        # Calculate monthly earnings (spent)
        current_month = timezone.now().month
        monthly_contracts = client_contracts.filter(created_at__month=current_month)
        stats.monthly_earnings = sum([contract.total_amount for contract in monthly_contracts])
        
        # Calculate weekly earnings (spent)
        week_ago = timezone.now() - timedelta(days=7)
        weekly_contracts = client_contracts.filter(created_at__gte=week_ago)
        stats.weekly_earnings = sum([contract.total_amount for contract in weekly_contracts])
        
        # Calculate jobs this month
        stats.jobs_this_month = active_projects.filter(created_at__month=current_month).count()
        
        # Calculate proposals this month
        stats.proposals_this_month = 0  # Clients don't send proposals
        
        # Calculate average rating
        reviews = Review.objects.filter(project__client=user)
        if reviews.exists():
            stats.average_rating = sum([review.rating for review in reviews]) / reviews.count()
        else:
            stats.average_rating = 0
            
        # Calculate pending payments
        stats.pending_payments = Payment.objects.filter(
            contract__client=user, 
            status='pending'
        ).count()
        
        stats.save()
        
        # Get active projects
        active_projects_data = []
        for project in active_projects[:5]:
            contract = project.contracts.first()
            if contract:
                active_projects_data.append({
                    'id': project.id,
                    'slug': project.slug,  # Add slug field
                    'title': project.title,
                    'client': {
                        'id': user.id,
                        'first_name': user.first_name or '',
                        'last_name': user.last_name or '',
                        'email': user.email,
                        'avatar': user.avatar.url if user.avatar else None
                    },
                    'status': contract.status,
                    'progress': contract.completion_percentage or 0,
                    'budget': contract.total_amount,
                    'deadline': contract.end_date,
                    'location': project.location,
                    'category': project.category.name if project.category else 'General',
                    'priority': 'normal',  # Default priority
                    'last_update': contract.updated_at,
                    'contract_type': contract.payment_type,
                    'created_at': project.created_at,
                    'updated_at': project.updated_at
                })
        
        # Get recent messages
        recent_messages = []
        user_conversations = Conversation.objects.filter(participants=user)
        for conversation in user_conversations[:3]:
            last_message = conversation.messages.last()
            if last_message and last_message.sender != user:
                recent_messages.append({
                    'id': last_message.message_id,
                    'from': {
                        'id': last_message.sender.id,
                        'first_name': last_message.sender.first_name or '',
                        'last_name': last_message.sender.last_name or '',
                        'email': last_message.sender.email,
                        'avatar': last_message.sender.avatar.url if last_message.sender.avatar else None
                    },
                    'message': last_message.content,
                    'time': last_message.created_at,
                    'unread': True,  # Default to unread
                    'project': {
                        'id': conversation.project.id if conversation.project else 0,
                        'title': conversation.project.title if conversation.project else 'General'
                    },
                    'created_at': last_message.created_at
                })
        
        # Get recent earnings (payments made)
        recent_earnings = []
        recent_payments = Payment.objects.filter(contract__client=user).order_by('-created_at')[:5]
        for payment in recent_payments:
            recent_earnings.append({
                'id': payment.id,
                'project': {
                    'id': payment.contract.project.id if payment.contract.project else 0,
                    'title': payment.contract.project.title if payment.contract.project else 'Contract Payment'
                },
                'client': {
                    'id': user.id,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or '',
                    'email': user.email
                },
                'amount': payment.amount,
                'date': payment.created_at,
                'status': payment.status,
                'type': payment.payment_type,
                'created_at': payment.created_at
            })
        
        # Create analytics data
        analytics = {
            'earnings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]  # Placeholder data
            },
            'jobs_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]  # Placeholder data
            },
            'proposals_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]  # Placeholder data
            },
            'ratings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [0, 0, 0, 0, 0, 0]  # Placeholder data
            }
        }
        
        response_data = {
            'stats': {
                'active_jobs': stats.active_jobs,
                'total_earned': float(stats.total_earned),
                'proposals_sent': stats.proposals_sent,
                'success_rate': float(stats.success_rate),
                'completed_jobs': stats.completed_jobs,
                'pending_payments': stats.pending_payments,
                'average_rating': float(stats.average_rating),
                'total_clients': stats.total_clients,
                'monthly_earnings': float(stats.monthly_earnings),
                'weekly_earnings': float(stats.weekly_earnings),
                'jobs_this_month': stats.jobs_this_month,
                'proposals_this_month': stats.proposals_this_month
            },
            'active_jobs': active_projects_data,
            'new_jobs': [],  # Clients don't have new jobs
            'recent_messages': recent_messages,
            'recent_earnings': recent_earnings,
            'analytics': analytics
        }
        
        print(f"✅ Client dashboard data prepared successfully")
        return Response(response_data)
        
    except Exception as e:
        print(f"❌ Error in client_dashboard: {e}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Internal server error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    try:
        user = request.user
        stats, created = DashboardStats.objects.get_or_create(user=user)
        return Response(DashboardStatsSerializer(stats).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load stats: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def active_jobs(request):
    """Get active jobs for dashboard"""
    try:
        user = request.user
        if hasattr(user, 'professional'):
            # Professional view
            active_contracts = Contract.objects.filter(professional=user, status__in=['active', 'in_progress'])
        else:
            # Client view
            active_contracts = Contract.objects.filter(client=user, status__in=['active', 'in_progress'])
        
        jobs_data = []
        for contract in active_contracts[:10]:
            jobs_data.append({
                'id': contract.id,
                'title': contract.title,
                'client': {
                    'id': contract.client.id,
                    'first_name': contract.client.first_name,
                    'last_name': contract.client.last_name,
                    'email': contract.client.email,
                    'avatar': contract.client.avatar.url if contract.client.avatar else None
                },
                'status': contract.status,
                'progress': contract.completion_percentage or 0,
                'budget': contract.total_amount,
                'deadline': contract.end_date,
                'location': contract.project.location if contract.project else 'N/A',
                'category': contract.project.category.name if contract.project and contract.project.category else 'N/A',
                'priority': 'medium',  # Default priority
                'last_update': contract.updated_at,
                'contract_type': contract.payment_type,
                'created_at': contract.created_at,
                'updated_at': contract.updated_at
            })
        
        return Response(jobs_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load active jobs: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def new_jobs(request):
    """Get new jobs for professionals"""
    try:
        user = request.user
        if not hasattr(user, 'professional'):
            return Response({'error': 'Only professionals can view new jobs'}, status=status.HTTP_403_FORBIDDEN)
        
        recent_projects = Project.objects.filter(
            status='open',
            created_at__gte=timezone.now() - timedelta(days=30)
        ).exclude(
            proposals__professional=user
        )[:10]
        
        jobs_data = []
        for project in recent_projects:
            proposals_count = project.proposals.count()
            jobs_data.append({
                'id': project.id,
                'title': project.title,
                'client': {
                    'id': project.client.id,
                    'first_name': project.client.first_name,
                    'last_name': project.client.last_name,
                    'email': project.client.email,
                    'avatar': project.client.avatar.url if project.client.avatar else None
                },
                'budget_min': project.budget_min,
                'budget_max': project.budget_max,
                'location': project.location,
                'category': project.category.name,
                'posted_time': project.created_at,
                'proposals_count': proposals_count,
                'time_left': '5 days',  # Placeholder
                'verified': True,  # Placeholder
                'urgent': project.urgent,
                'description': project.description,
                'created_at': project.created_at
            })
        
        return Response(jobs_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load new jobs: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_messages(request):
    """Get recent messages for dashboard"""
    try:
        user = request.user
        user_conversations = Conversation.objects.filter(participants=user)
        
        messages_data = []
        for conversation in user_conversations[:5]:
            last_message = conversation.messages.last()
            if last_message and last_message.sender != user:
                messages_data.append({
                    'id': last_message.id,
                    'from': {
                        'id': last_message.sender.id,
                        'first_name': last_message.sender.first_name,
                        'last_name': last_message.sender.last_name,
                        'email': last_message.sender.email,
                        'avatar': last_message.sender.avatar.url if last_message.sender.avatar else None
                    },
                    'message': last_message.content[:100] + '...' if len(last_message.content) > 100 else last_message.content,
                    'time': last_message.created_at,
                    'unread': not last_message.read_by.filter(id=user.id).exists(),
                    'project': {
                        'id': conversation.project.id if conversation.project else 0,
                        'title': conversation.project.title if conversation.project else 'General'
                    },
                    'created_at': last_message.created_at
                })
        
        return Response(messages_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load recent messages: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_earnings(request):
    """Get recent earnings for professionals"""
    try:
        user = request.user
        if not hasattr(user, 'professional'):
            return Response({'error': 'Only professionals can view earnings'}, status=status.HTTP_403_FORBIDDEN)
        
        recent_payments = Payment.objects.filter(
            contract__professional=user,
            status='completed'
        ).order_by('-created_at')[:10]
        
        earnings_data = []
        for payment in recent_payments:
            earnings_data.append({
                'id': payment.id,
                'project': {
                    'id': payment.contract.project.id,
                    'title': payment.contract.project.title
                },
                'client': {
                    'id': payment.contract.client.id,
                    'first_name': payment.contract.client.first_name,
                    'last_name': payment.contract.client.last_name,
                    'email': payment.contract.client.email
                },
                'amount': payment.amount,
                'date': payment.created_at.date(),
                'status': payment.status,
                'type': payment.payment_type,
                'created_at': payment.created_at
            })
        
        return Response(earnings_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load recent earnings: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    """Get dashboard analytics data"""
    try:
        user = request.user
        timeframe = request.GET.get('timeframe', 'month')
        
        analytics = {
            'earnings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [1000, 1500, 2000, 1800, 2500, 3000]
            },
            'jobs_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [5, 8, 12, 10, 15, 18]
            },
            'proposals_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [10, 15, 20, 18, 25, 30]
            },
            'ratings_chart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data': [4.5, 4.7, 4.8, 4.6, 4.9, 5.0]
            }
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load analytics: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_job_progress(request, job_id):
    """Update job progress"""
    try:
        user = request.user
        contract = Contract.objects.get(id=job_id, professional=user)
        
        progress = request.data.get('progress', 0)
        status = request.data.get('status', contract.status)
        notes = request.data.get('notes', '')
        
        contract.progress = progress
        contract.status = status
        if notes:
            contract.notes = notes
        contract.save()
        
        return Response({'message': 'Job progress updated successfully'}, status=status.HTTP_200_OK)
    except Contract.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'error': f'Failed to update job progress: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_message_read(request, message_id):
    """Mark message as read"""
    try:
        user = request.user
        message = Message.objects.get(id=message_id)
        message.read_by.add(user)
        return Response({'message': 'Message marked as read'}, status=status.HTTP_200_OK)
    except Message.DoesNotExist:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'error': f'Failed to mark message as read: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_recommendations(request):
    """Get job recommendations for professionals"""
    try:
        user = request.user
        if not hasattr(user, 'professional'):
            return Response({'error': 'Only professionals can view job recommendations'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get projects that match professional's skills
        professional_skills = user.professional.skills.all() if hasattr(user, 'professional') else []
        
        recommended_projects = Project.objects.filter(
            status='open',
            category__in=[skill.category for skill in professional_skills]
        ).exclude(
            proposals__professional=user
        )[:10]
        
        jobs_data = []
        for project in recommended_projects:
            proposals_count = project.proposals.count()
            jobs_data.append({
                'id': project.id,
                'title': project.title,
                'client': {
                    'id': project.client.id,
                    'first_name': project.client.first_name,
                    'last_name': project.client.last_name,
                    'email': project.client.email,
                    'avatar': project.client.avatar.url if project.client.avatar else None
                },
                'budget_min': project.budget_min,
                'budget_max': project.budget_max,
                'location': project.location,
                'category': project.category.name,
                'posted_time': project.created_at,
                'proposals_count': proposals_count,
                'time_left': '5 days',  # Placeholder
                'verified': True,  # Placeholder
                'urgent': project.urgent,
                'description': project.description,
                'created_at': project.created_at
            })
        
        return Response(jobs_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load job recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def performance_metrics(request):
    """Get performance metrics for professionals"""
    try:
        user = request.user
        if not hasattr(user, 'professional'):
            return Response({'error': 'Only professionals can view performance metrics'}, status=status.HTTP_403_FORBIDDEN)
        
        metrics, created = PerformanceMetrics.objects.get_or_create(user=user)
        
        # Calculate metrics from actual data
        completed_contracts = Contract.objects.filter(professional=user, status='completed')
        total_contracts = Contract.objects.filter(professional=user)
        
        if total_contracts.count() > 0:
            metrics.completion_rate = (completed_contracts.count() / total_contracts.count()) * 100
        else:
            metrics.completion_rate = 0
        
        reviews = Review.objects.filter(reviewee=user)
        if reviews.exists():
            metrics.average_rating = sum([review.rating for review in reviews]) / reviews.count()
        else:
            metrics.average_rating = 0
        
        metrics.total_projects = total_contracts.count()
        metrics.repeat_clients = total_contracts.values('client').distinct().count()
        
        # Calculate response time (average time to respond to messages)
        user_messages = Message.objects.filter(sender=user)
        if user_messages.exists():
            total_response_time = 0
            response_count = 0
            for message in user_messages:
                if message.reply_to:
                    response_time = (message.created_at - message.reply_to.created_at).total_seconds() / 3600
                    total_response_time += response_time
                    response_count += 1
            
            if response_count > 0:
                metrics.response_time = total_response_time / response_count
            else:
                metrics.response_time = 0
        else:
            metrics.response_time = 0
        
        # Calculate client satisfaction
        if reviews.exists():
            metrics.client_satisfaction = sum([review.rating for review in reviews]) / reviews.count()
        else:
            metrics.client_satisfaction = 0
        
        metrics.save()
        
        return Response(PerformanceMetricsSerializer(metrics).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load performance metrics: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_deadlines(request):
    """Get upcoming deadlines"""
    try:
        user = request.user
        if hasattr(user, 'professional'):
            contracts = Contract.objects.filter(professional=user, status__in=['active', 'in_progress'])
        else:
            contracts = Contract.objects.filter(client=user, status__in=['active', 'in_progress'])
        
        upcoming_deadlines = []
        for contract in contracts:
            if contract.deadline and contract.deadline > timezone.now().date():
                upcoming_deadlines.append({
                    'id': contract.id,
                    'title': contract.project.title,
                    'client': {
                        'id': contract.client.id,
                        'first_name': contract.client.first_name,
                        'last_name': contract.client.last_name,
                        'email': contract.client.email,
                        'avatar': contract.client.avatar.url if contract.client.avatar else None
                    },
                    'status': contract.status,
                    'progress': contract.progress or 0,
                    'budget': contract.total_amount,
                    'deadline': contract.deadline,
                    'location': contract.project.location,
                    'category': contract.project.category.name,
                    'priority': contract.priority,
                    'last_update': contract.updated_at,
                    'contract_type': contract.contract_type,
                    'created_at': contract.created_at,
                    'updated_at': contract.updated_at
                })
        
        # Sort by deadline
        upcoming_deadlines.sort(key=lambda x: x['deadline'])
        
        return Response(upcoming_deadlines[:10], status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load upcoming deadlines: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_actions(request):
    """Get pending actions"""
    try:
        user = request.user
        pending_actions, created = PendingAction.objects.get_or_create(user=user)
        
        if hasattr(user, 'professional'):
            # Professional view
            pending_actions.pending_proposals = Proposal.objects.filter(professional=user, status='pending').count()
            pending_actions.pending_contracts = Contract.objects.filter(professional=user, status='pending').count()
            pending_actions.pending_payments = Payment.objects.filter(contract__professional=user, status='pending').count()
            pending_actions.pending_reviews = Review.objects.filter(reviewee=user, response__isnull=True).count()
            pending_actions.urgent_jobs = Contract.objects.filter(professional=user, priority='high', status__in=['active', 'in_progress']).count()
        else:
            # Client view
            pending_actions.pending_proposals = 0  # Clients don't send proposals
            pending_actions.pending_contracts = Contract.objects.filter(client=user, status='pending').count()
            pending_actions.pending_payments = Payment.objects.filter(contract__client=user, status='pending').count()
            pending_actions.pending_reviews = Review.objects.filter(project__client=user, response__isnull=True).count()
            pending_actions.urgent_jobs = Project.objects.filter(client=user, urgent=True, status='in_progress').count()
        
        pending_actions.save()
        
        return Response(PendingActionSerializer(pending_actions).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load pending actions: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    """Get dashboard notifications"""
    try:
        user = request.user
        notifications = DashboardNotification.objects.filter(user=user).order_by('-created_at')[:20]
        return Response(DashboardNotificationSerializer(notifications, many=True).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load notifications: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark notification as read"""
    try:
        user = request.user
        notification = DashboardNotification.objects.get(id=notification_id, user=user)
        notification.read = True
        notification.save()
        return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)
    except DashboardNotification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'error': f'Failed to mark notification as read: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quick_actions(request):
    """Get quick actions for dashboard"""
    try:
        user = request.user
        quick_actions = QuickAction.objects.filter(user=user, active=True).order_by('order')
        return Response(QuickActionSerializer(quick_actions, many=True).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to load quick actions: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
