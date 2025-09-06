from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    # Review management
    path('', views.ReviewListView.as_view(), name='review_list'),
    path('<int:pk>/', views.ReviewDetailView.as_view(), name='review_detail'),
    path('create/', views.ReviewCreateView.as_view(), name='review_create'),
    path('<int:pk>/update/', views.ReviewUpdateView.as_view(), name='review_update'),
    path('<int:pk>/delete/', views.ReviewDeleteView.as_view(), name='review_delete'),
    
    # Professional reviews
    path('professional/<int:professional_id>/', views.ProfessionalReviewsView.as_view(), name='professional_reviews'),
    path('professional/<int:professional_id>/stats/', views.review_stats, name='professional_review_stats'),
    
    # Client reviews
    path('client/<int:client_id>/', views.ClientReviewsView.as_view(), name='client_reviews'),
    
    # My reviews
    path('my/', views.MyReviewsView.as_view(), name='my_reviews'),
    
    # Review analytics
    path('summary/', views.review_summary, name='review_summary'),
    path('filters/', views.review_filters, name='review_filters'),
    path('report/', views.review_report, name='review_report'),
    path('top-rated/', views.top_rated_professionals, name='top_rated_professionals'),
    path('check-eligibility/<int:contract_id>/', views.check_review_eligibility, name='check_review_eligibility'),
]