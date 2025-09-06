from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils import timezone
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import datetime, timedelta
from .models import PaymentMethod, Payment, Wallet, WalletTransaction, Withdrawal, BankAccount
from .serializers import (
    PaymentMethodSerializer, PaymentMethodCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer, PaymentProcessSerializer,
    PaymentStatsSerializer,
    PaymentHistorySerializer, PaymentSummarySerializer,
    WalletSerializer, WalletTransactionSerializer, WalletTopUpSerializer,
    WithdrawalSerializer, WithdrawalCreateSerializer,
    BankAccountSerializer, BankAccountCreateSerializer
)
from .authorize_net_service import authorize_net_service

User = get_user_model()


class PaymentMethodListView(generics.ListAPIView):
    """قائمة طرق الدفع"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="list_payment_methods",
        summary="List Payment Methods",
        description="Get current user's payment methods list",
        tags=["Payments"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PaymentMethodCreateView(generics.CreateAPIView):
    """إضافة طريقة دفع جديدة"""
    serializer_class = PaymentMethodCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_payment_method",
        summary="إضافة طريقة دفع جديدة",
        description="إضافة طريقة دفع جديدة للمستخدم",
        tags=["Payment Methods"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class PaymentMethodUpdateView(generics.UpdateAPIView):
    """تحديث طريقة الدفع"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="update_payment_method",
        summary="تحديث طريقة الدفع",
        description="تحديث طريقة دفع موجودة",
        tags=["Payment Methods"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class PaymentMethodDeleteView(generics.DestroyAPIView):
    """حذف طريقة الدفع"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_default:
            # Find another payment method to set as default
            other_method = PaymentMethod.objects.filter(
                user=request.user
            ).exclude(id=instance.id).first()
            if other_method:
                other_method.is_default = True
                other_method.save()
        
        return super().destroy(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="delete_payment_method",
        summary="حذف طريقة الدفع",
        description="حذف طريقة دفع موجودة",
        tags=["Payment Methods"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class PaymentListView(generics.ListAPIView):
    """List user's payments"""
    serializer_class = PaymentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'currency']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(
            Q(payer=user) | Q(payee=user)
        ).select_related('payer', 'payee', 'contract', 'payment_method')
    
    @extend_schema(
        operation_id="list_payments",
        summary="List Payments",
        description="Get current user's payments list",
        tags=["Payments"],
        parameters=[
            OpenApiParameter(
                name="status",
                description="حالة الدفع",
                required=False,
                type=OpenApiTypes.STR,
                enum=['pending', 'processing', 'succeeded', 'failed', 'cancelled']
            ),
            OpenApiParameter(
                name="currency",
                description="العملة",
                required=False,
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PaymentDetailView(generics.RetrieveAPIView):
    """تفاصيل الدفع"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(
            Q(payer=user) | Q(payee=user)
        ).select_related('payer', 'payee', 'contract', 'payment_method')
    
    @extend_schema(
        operation_id="get_payment_detail",
        summary="Payment Details",
        description="Get specific payment details",
        tags=["Payments"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PaymentCreateView(generics.CreateAPIView):
    """إنشاء دفع جديد"""
    serializer_class = PaymentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        payment = serializer.save()
        # Here you would integrate with Stripe or other payment processor
        # For now, we'll just set it as pending
        payment.status = 'pending'
        payment.save()
    
    @extend_schema(
        operation_id="create_payment",
        summary="Create New Payment",
        description="Create new payment for contract or milestone",
        tags=["Payments"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class PaymentProcessView(APIView):
    """معالجة الدفع"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="process_payment",
        summary="معالجة الدفع",
        description="معالجة الدفع مع Stripe أو مقدم الدفع",
        tags=["Payments"],
        request=PaymentProcessSerializer,
    )
    def post(self, request):
        serializer = PaymentProcessSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            payment_id = serializer.validated_data['payment_id']
            
            try:
                payment = Payment.objects.get(id=payment_id)
                payment_method = payment.payment_method
                
                # Set payment status to processing
                payment.status = 'processing'
                payment.save()
                
                # Process payment based on payment method type
                if payment_method and payment_method.type == 'authorize_net':
                    # Process with Authorize.Net
                    result = self._process_authorize_net_payment(payment, request.data)
                elif payment_method and payment_method.type == 'stripe':
                    # Process with Stripe (existing logic)
                    result = self._process_stripe_payment(payment, request.data)
                else:
                    # Default processing (simulate success for now)
                    result = {'success': True, 'message': 'Payment processed successfully'}
                
                if result['success']:
                    payment.status = 'succeeded'
                    payment.processed_at = timezone.now()
                    payment.save()
                    
                    # Update contract paid amount if applicable
                    if payment.contract:
                        contract = payment.contract
                        contract.paid_amount += payment.amount
                        contract.save()
                    
                    # Update milestone if applicable
                    if payment.milestone:
                        milestone = payment.milestone
                        milestone.status = 'completed'
                        milestone.payment_date = timezone.now().date()
                        milestone.save()
                    
                    return Response({
                        'message': result['message'],
                        'payment_id': payment.payment_id,
                        'status': payment.status,
                        'transaction_id': result.get('transaction_id')
                    })
                else:
                    payment.status = 'failed'
                    payment.save()
                    return Response({
                        'error': result['error'],
                        'payment_id': payment.payment_id,
                        'status': payment.status
                    }, status=status.HTTP_400_BAD_REQUEST)
                
            except Payment.DoesNotExist:
                return Response({
                    'error': 'Payment not found'
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({
                    'error': 'Payment processing failed',
                    'details': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MilestonePaymentRequestView(APIView):
    """طلب دفع مرحلة من المحترف"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="request_milestone_payment",
        summary="طلب دفع مرحلة",
        description="طلب دفع مرحلة من المحترف للعميل",
        tags=["Payments"],
        request={
            'type': 'object',
            'properties': {
                'amount': {
                    'type': 'number',
                    'description': 'مبلغ الدفع المطلوب'
                },
                'description': {
                    'type': 'string',
                    'description': 'وصف الدفع'
                },
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            },
            'required': ['amount', 'description']
        }
    )
    def post(self, request, milestone_id):
        try:
            from contracts.models import ContractMilestone
            milestone = ContractMilestone.objects.get(id=milestone_id)
            user = request.user
            
            # Only professional can request milestone payment
            if user != milestone.contract.professional:
                return Response(
                    {'error': 'Only the professional can request milestone payment'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if milestone is already paid
            if milestone.status == 'completed' and milestone.payment_date:
                return Response(
                    {'error': 'Milestone is already paid'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            amount = request.data.get('amount')
            description = request.data.get('description')
            notes = request.data.get('notes', '')
            
            # Validate amount
            if not amount or float(amount) <= 0:
                return Response(
                    {'error': 'Invalid amount'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create payment request
            payment = Payment.objects.create(
                amount=amount,
                payment_type='milestone_payment',
                status='pending',
                payer=milestone.contract.client,
                payee=milestone.contract.professional,
                contract=milestone.contract,
                milestone=milestone,
                description=f"{description}\n\nNotes: {notes}" if notes else description
            )
            
            # Update milestone status
            milestone.status = 'in_progress'
            milestone.save()
            
            return Response({
                'message': 'Milestone payment request created successfully',
                'payment_id': payment.id,
                'payment_uuid': str(payment.payment_id),
                'amount': float(payment.amount),
                'status': payment.status
            })
            
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to create milestone payment request: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MilestonePaymentApprovalView(APIView):
    """موافقة العميل على دفع مرحلة"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="approve_milestone_payment",
        summary="الموافقة على دفع مرحلة",
        description="موافقة العميل على دفع مرحلة للمحترف",
        tags=["Payments"],
        request={
            'type': 'object',
            'properties': {
                'payment_id': {
                    'type': 'integer',
                    'description': 'معرف الدفع'
                },
                'approved': {
                    'type': 'boolean',
                    'description': 'الموافقة أو الرفض'
                },
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات العميل'
                }
            },
            'required': ['payment_id', 'approved']
        }
    )
    def post(self, request, milestone_id):
        try:
            from contracts.models import ContractMilestone
            milestone = ContractMilestone.objects.get(id=milestone_id)
            user = request.user
            
            # Only client can approve milestone payment
            if user != milestone.contract.client:
                return Response(
                    {'error': 'Only the client can approve milestone payment'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            payment_id = request.data.get('payment_id')
            approved = request.data.get('approved')
            notes = request.data.get('notes', '')
            
            # Get the payment
            payment = Payment.objects.get(
                id=payment_id,
                milestone=milestone,
                status='pending'
            )
            
            if approved:
                # Check client's pending balance
                client_wallet, created = Wallet.objects.get_or_create(user=user)
                
                if client_wallet.pending_balance < payment.amount:
                    return Response(
                        {'error': 'Insufficient pending balance'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Get or create professional's wallet
                professional_wallet, created = Wallet.objects.get_or_create(
                    user=milestone.contract.professional
                )
                
                # Transfer funds from client's pending to professional's pending
                client_wallet.pending_balance -= payment.amount
                client_wallet.save()
                
                professional_wallet.pending_balance += payment.amount
                professional_wallet.save()
                
                # Create wallet transactions
                WalletTransaction.objects.create(
                    wallet=client_wallet,
                    amount=payment.amount,
                    transaction_type='debit',
                    source='milestone_payment',
                    description=f'Milestone payment to {milestone.contract.professional.get_display_name()}',
                    payment=payment
                )
                
                WalletTransaction.objects.create(
                    wallet=professional_wallet,
                    amount=payment.amount,
                    transaction_type='credit',
                    source='milestone_payment',
                    description=f'Milestone payment from {milestone.contract.client.get_display_name()}',
                    payment=payment
                )
                
                # Update payment status
                payment.status = 'succeeded'
                payment.processed_at = timezone.now()
                payment.description = f"{payment.description}\nClient approval notes: {notes}" if notes else payment.description
                payment.save()
                
                # Update milestone
                milestone.status = 'completed'
                milestone.payment_date = timezone.now().date()
                milestone.save()
                
                # Update contract paid amount
                milestone.contract.paid_amount += payment.amount
                milestone.contract.save()
                
                return Response({
                    'message': 'Milestone payment approved and processed successfully',
                    'payment_id': payment.id,
                    'amount_transferred': float(payment.amount),
                    'client_pending_balance': float(client_wallet.pending_balance),
                    'professional_pending_balance': float(professional_wallet.pending_balance)
                })
            else:
                # Payment rejected
                payment.status = 'cancelled'
                payment.description = f"{payment.description}\nClient rejection notes: {notes}" if notes else payment.description
                payment.save()
                
                # Update milestone status back to pending
                milestone.status = 'pending'
                milestone.save()
                
                return Response({
                    'message': 'Milestone payment rejected',
                    'payment_id': payment.id,
                    'status': payment.status
                })
                
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found or already processed'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to process milestone payment approval: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PendingMilestonePaymentsView(APIView):
    """جلب طلبات الدفع المعلقة للعميل"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="get_pending_milestone_payments",
        summary="جلب طلبات الدفع المعلقة",
        description="جلب طلبات دفع المراحل المعلقة للعميل",
        tags=["Payments"]
    )
    def get(self, request):
        try:
            user = request.user
            
            # Get pending milestone payments for the client
            pending_payments = Payment.objects.filter(
                payer=user,
                payment_type='milestone_payment',
                status='pending'
            ).select_related(
                'milestone__contract__professional',
                'milestone__contract'
            ).order_by('-created_at')
            
            payments_data = []
            for payment in pending_payments:
                payments_data.append({
                    'id': payment.id,
                    'milestone': {
                        'id': payment.milestone.id,
                        'title': payment.milestone.title,
                        'description': payment.milestone.description,
                        'contract': {
                            'id': payment.milestone.contract.id,
                            'title': payment.milestone.contract.title,
                            'professional': {
                                'id': payment.milestone.contract.professional.id,
                                'first_name': payment.milestone.contract.professional.first_name,
                                'last_name': payment.milestone.contract.professional.last_name,
                            }
                        }
                    },
                    'amount': float(payment.amount),
                    'description': payment.description,
                    'notes': payment.description,
                    'status': payment.status,
                    'created_at': payment.created_at.isoformat()
                })
            
            return Response({
                'results': payments_data,
                'count': len(payments_data)
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch pending milestone payments: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _process_authorize_net_payment(self, payment, request_data):
        """
        معالجة الدفع باستخدام Authorize.Net
        """
        try:
            # Get card details from request
            card_number = request_data.get('card_number')
            expiry_date = request_data.get('expiry_date')  # Format: MMYY
            card_code = request_data.get('card_code')
            cardholder_name = request_data.get('cardholder_name', '')
            
            if not all([card_number, expiry_date, card_code]):
                return {
                    'success': False,
                    'error': 'Missing required card information'
                }
            
            # Process payment with Authorize.Net
            result = authorize_net_service.charge_credit_card(
                amount=payment.amount,
                card_number=card_number,
                expiry_date=expiry_date,
                card_code=card_code,
                cardholder_name=cardholder_name,
                description=f"Payment for {payment.payment_type}",
                invoice_number=str(payment.payment_id),
                customer_email=payment.payer.email,
                customer_id=str(payment.payer.id)
            )
            
            if result['success']:
                # Save Authorize.Net transaction details
                payment.authorize_net_transaction_id = result['transaction_id']
                payment.authorize_net_auth_code = result['auth_code']
                payment.authorize_net_response_code = result['response_code']
                payment.save()
                
                return {
                    'success': True,
                    'message': 'Payment processed successfully with Authorize.Net',
                    'transaction_id': result['transaction_id']
                }
            else:
                return {
                    'success': False,
                    'error': result['error']
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Authorize.Net processing error: {str(e)}'
            }
    
    def _process_stripe_payment(self, payment, request_data):
        """
        معالجة الدفع باستخدام Stripe (للمستقبل)
        """
        # TODO: Implement Stripe payment processing
        return {
            'success': True,
            'message': 'Stripe payment processing not implemented yet'
        }


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_stats(request):
    """إحصائيات المدفوعات"""
    user = request.user
    
    # Get payments where user is involved
    payments = Payment.objects.filter(Q(payer=user) | Q(payee=user))
    
    # Calculate stats
    total_payments = payments.count()
    total_amount_paid = payments.filter(payer=user, status='succeeded').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    total_amount_received = payments.filter(payee=user, status='succeeded').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    pending_payments = payments.filter(status='pending').count()
    succeeded_payments = payments.filter(status='succeeded').count()
    failed_payments = payments.filter(status='failed').count()
    
    # Calculate refunds from payments with refunded status
    total_refunds = payments.filter(status='refunded').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    # Current month stats
    current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    current_month_payments = payments.filter(
        payer=user,
        status='succeeded',
        processed_at__gte=current_month_start
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    current_month_earnings = payments.filter(
        payee=user,
        status='succeeded',
        processed_at__gte=current_month_start
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    stats = {
        'total_payments': total_payments,
        'total_amount_paid': total_amount_paid,
        'total_amount_received': total_amount_received,
        'pending_payments': pending_payments,
        'succeeded_payments': succeeded_payments,
        'failed_payments': failed_payments,
        'total_refunds': total_refunds,
        'current_month_payments': current_month_payments,
        'current_month_earnings': current_month_earnings
    }
    
    serializer = PaymentStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_summary(request):
    """ملخص المدفوعات حسب العقد"""
    user = request.user
    
    # Get contracts where user is involved
    from contracts.models import Contract
    contracts = Contract.objects.filter(
        Q(client=user) | Q(professional=user)
    )
    
    summaries = []
    for contract in contracts:
        payments = Payment.objects.filter(
            contract=contract,
            status='succeeded'
        )
        
        paid_amount = payments.aggregate(total=Sum('amount'))['total'] or 0
        remaining_amount = contract.total_amount - paid_amount
        completion_percentage = (paid_amount / contract.total_amount * 100) if contract.total_amount > 0 else 0
        
        last_payment = payments.order_by('-processed_at').first()
        
        summary = {
            'contract_id': contract.id,
            'contract_title': contract.title,
            'total_amount': contract.total_amount,
            'paid_amount': paid_amount,
            'remaining_amount': remaining_amount,
            'payment_count': payments.count(),
            'last_payment_date': last_payment.processed_at if last_payment else None,
            'completion_percentage': completion_percentage
        }
        summaries.append(summary)
    
    serializer = PaymentSummarySerializer(summaries, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_analytics(request):
    """تحليلات المدفوعات"""
    user = request.user
    
    # Get date range from query params
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    payments = Payment.objects.filter(
        Q(payer=user) | Q(payee=user),
        processed_at__gte=start_date,
        status='succeeded'
    )
    
    # Daily payment amounts
    daily_payments = {}
    for payment in payments:
        date_key = payment.processed_at.date().isoformat()
        if date_key not in daily_payments:
            daily_payments[date_key] = {
                'paid': 0,
                'received': 0,
                'count': 0
            }
        
        daily_payments[date_key]['count'] += 1
        if payment.payer == user:
            daily_payments[date_key]['paid'] += float(payment.amount)
        else:
            daily_payments[date_key]['received'] += float(payment.amount)
    
    # Payment method distribution
    payment_methods = payments.values('payment_method__provider').annotate(
        count=Count('id'),
        total=Sum('amount')
    )
    
    # Payment status distribution
    all_payments = Payment.objects.filter(Q(payer=user) | Q(payee=user))
    status_distribution = all_payments.values('status').annotate(count=Count('id'))
    
    return Response({
        'daily_payments': daily_payments,
        'payment_methods': list(payment_methods),
        'status_distribution': list(status_distribution),
        'date_range': {
            'start': start_date.date().isoformat(),
            'end': timezone.now().date().isoformat(),
            'days': days
        }
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_authorize_net_payment_method(request):
    """
    إضافة طريقة دفع Authorize.Net جديدة
    """
    try:
        card_number = request.data.get('card_number')
        expiry_date = request.data.get('expiry_date')  # Format: MMYY
        card_code = request.data.get('card_code')
        cardholder_name = request.data.get('cardholder_name', '')
        
        if not all([card_number, expiry_date, card_code]):
            return Response({
                'error': 'Missing required card information'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate card with Authorize.Net
        validation_result = authorize_net_service.validate_card(
            card_number=card_number,
            expiry_date=expiry_date,
            card_code=card_code
        )
        
        if validation_result['success']:
            # Create payment method
            payment_method = PaymentMethod.objects.create(
                user=request.user,
                type='authorize_net',
                provider='Authorize.Net',
                last4=card_number[-4:],
                expiry_date=f"{expiry_date[:2]}/{expiry_date[2:]}",  # Convert MMYY to MM/YY
                cardholder_name=cardholder_name,
                is_verified=True
            )
            
            # Set as default if it's the first payment method
            if not PaymentMethod.objects.filter(user=request.user, is_default=True).exists():
                payment_method.is_default = True
                payment_method.save()
            
            serializer = PaymentMethodSerializer(payment_method)
            return Response({
                'message': 'Payment method added successfully',
                'payment_method': serializer.data
            })
        else:
            return Response({
                'error': f'Card validation failed: {validation_result["error"]}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': f'Failed to add payment method: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_default_payment_method(request, method_id):
    """تعيين طريقة الدفع الافتراضية"""
    try:
        # Remove default from all user's payment methods
        PaymentMethod.objects.filter(
            user=request.user,
            is_default=True
        ).update(is_default=False)
        
        # Set the new default
        payment_method = PaymentMethod.objects.get(
            id=method_id,
            user=request.user
        )
        payment_method.is_default = True
        payment_method.save()
        
        return Response({
            'message': 'Default payment method updated successfully',
            'method_id': method_id
        })
        
    except PaymentMethod.DoesNotExist:
        return Response({
            'error': 'Payment method not found'
        }, status=status.HTTP_404_NOT_FOUND)


class PaymentMethodSetDefaultView(APIView):
    """تعيين طريقة الدفع كافتراضية"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="set_default_payment_method",
        summary="Set Default Payment Method",
        description="Set a payment method as default for the user",
        tags=["Payment Methods"],
    )
    def post(self, request, pk):
        try:
            # Get the payment method
            payment_method = PaymentMethod.objects.get(
                id=pk,
                user=request.user
            )
            
            # Set all other methods as non-default
            PaymentMethod.objects.filter(
                user=request.user
            ).update(is_default=False)
            
            # Set this method as default
            payment_method.is_default = True
            payment_method.save()
            
            return Response({
                'success': True,
                'message': 'Payment method set as default successfully',
                'data': PaymentMethodSerializer(payment_method).data
            })
            
        except PaymentMethod.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Payment method not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


# Wallet Views
class WalletDetailView(generics.RetrieveAPIView):
    """عرض تفاصيل المحفظة"""
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        wallet, created = Wallet.objects.get_or_create(
            user=self.request.user,
            defaults={'currency_id': 1}  # Default to USD
        )
        return wallet
    
    @extend_schema(
        operation_id="get_wallet_details",
        summary="تفاصيل المحفظة",
        description="الحصول على تفاصيل محفظة المستخدم",
        tags=["Wallet"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class WalletTransactionListView(generics.ListAPIView):
    """قائمة معاملات المحفظة"""
    serializer_class = WalletTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['transaction_type', 'source']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        wallet, created = Wallet.objects.get_or_create(
            user=self.request.user,
            defaults={'currency_id': 1}
        )
        return WalletTransaction.objects.filter(wallet=wallet)
    
    @extend_schema(
        operation_id="list_wallet_transactions",
        summary="قائمة معاملات المحفظة",
        description="الحصول على قائمة معاملات المحفظة للمستخدم",
        tags=["Wallet"],
        parameters=[
            OpenApiParameter(
                name="transaction_type",
                description="نوع المعاملة",
                required=False,
                type=OpenApiTypes.STR,
                enum=['credit', 'debit']
            ),
            OpenApiParameter(
                name="source",
                description="مصدر المعاملة",
                required=False,
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def wallet_topup(request):
    """شحن المحفظة"""
    serializer = WalletTopUpSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        try:
            amount = serializer.validated_data['amount']
            payment_method_id = serializer.validated_data['payment_method_id']
            description = serializer.validated_data.get('description', 'Wallet top-up')
            
            # Get or create wallet
            wallet, created = Wallet.objects.get_or_create(
                user=request.user,
                defaults={'currency_id': 1}
            )
            
            # Get payment method
            payment_method = PaymentMethod.objects.get(
                id=payment_method_id,
                user=request.user
            )
            
            # Create payment record
            payment = Payment.objects.create(
                payer=request.user,
                payee=request.user,  # Self payment for wallet top-up
                amount=amount,
                currency_id=1,  # USD
                payment_method=payment_method,
                payment_type='wallet_topup',
                description=description,
                status='processing'
            )
            
            # Process payment with Authorize.Net
            try:
                # Here you would integrate with actual payment processing
                # For now, we'll simulate successful payment
                
                # Add funds to wallet
                wallet.add_funds(amount)
                
                # Create wallet transaction
                WalletTransaction.objects.create(
                    wallet=wallet,
                    amount=amount,
                    transaction_type='credit',
                    source='topup',
                    description=description,
                    payment=payment
                )
                
                # Update payment status
                payment.status = 'succeeded'
                payment.processed_at = timezone.now()
                payment.save()
                
                return Response({
                    'success': True,
                    'message': 'Wallet topped up successfully',
                    'wallet': WalletSerializer(wallet).data,
                    'transaction_id': payment.payment_id
                })
                
            except Exception as e:
                payment.status = 'failed'
                payment.save()
                return Response({
                    'error': 'Payment processing failed',
                    'details': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except PaymentMethod.DoesNotExist:
            return Response({
                'error': 'Payment method not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': 'Wallet top-up failed',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def wallet_stats(request):
    """إحصائيات المحفظة"""
    try:
        wallet, created = Wallet.objects.get_or_create(
            user=request.user,
            defaults={'currency_id': 1}
        )
        
        # Get transaction statistics
        transactions = WalletTransaction.objects.filter(wallet=wallet)
        
        total_credits = transactions.filter(transaction_type='credit').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        total_debits = transactions.filter(transaction_type='debit').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Current month stats
        current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        current_month_credits = transactions.filter(
            transaction_type='credit',
            created_at__gte=current_month_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        current_month_debits = transactions.filter(
            transaction_type='debit',
            created_at__gte=current_month_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Calculate platform earnings (exclude wallet top-ups)
        platform_earnings = transactions.filter(
            transaction_type='credit'
        ).exclude(
            source__in=['wallet_topup', 'topup', 'manual_topup']
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        stats = {
            'available_balance': wallet.available_balance,
            'pending_balance': wallet.pending_balance,
            'total_earned': platform_earnings,  # Only platform earnings, not topups
            'total_balance': wallet.total_balance,
            'total_credits': total_credits,
            'total_debits': total_debits,
            'current_month_credits': current_month_credits,
            'current_month_debits': current_month_debits,
            'transaction_count': transactions.count()
        }
        
        return Response(stats)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get wallet stats',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pending_transactions_with_release_dates(request):
    """جلب المعاملات المعلقة مع تواريخ الإفراج المتوقعة"""
    try:
        wallet, created = Wallet.objects.get_or_create(
            user=request.user,
            defaults={'currency_id': 1}
        )
        
        # Get pending transactions (those with 'pending' in source or description)
        pending_transactions = WalletTransaction.objects.filter(
            wallet=wallet,
            transaction_type='credit'
        ).filter(
            Q(source__icontains='pending') | 
            Q(description__icontains='pending') |
            Q(source__icontains='milestone')
        ).order_by('-created_at')
        
        transactions_with_release = []
        for transaction in pending_transactions:
            # Calculate expected release date (3 days from creation)
            expected_release_date = transaction.created_at + timedelta(days=3)
            
            transactions_with_release.append({
                'id': transaction.id,
                'amount': transaction.amount,
                'description': transaction.description,
                'source': transaction.source,
                'created_at': transaction.created_at,
                'expected_release_date': expected_release_date,
                'days_remaining': max(0, (expected_release_date - timezone.now()).days),
                'is_ready_for_release': timezone.now() >= expected_release_date
            })
        
        return Response({
            'pending_transactions': transactions_with_release,
            'total_pending_amount': sum(t['amount'] for t in transactions_with_release),
            'count': len(transactions_with_release)
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to get pending transactions',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


class WithdrawalListView(generics.ListAPIView):
    """List user's withdrawal requests"""
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'currency']
    ordering_fields = ['requested_at', 'amount']
    ordering = ['-requested_at']
    
    def get_queryset(self):
        return Withdrawal.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="list_withdrawals",
        summary="List Withdrawal Requests",
        description="Get current user's withdrawal requests",
        tags=["Withdrawals"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class WithdrawalCreateView(generics.CreateAPIView):
    """Create withdrawal request"""
    serializer_class = WithdrawalCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_withdrawal",
        summary="Create Withdrawal Request",
        description="Create a new withdrawal request",
        tags=["Withdrawals"],
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_create(self, serializer):
        """Create withdrawal and deduct from wallet"""
        withdrawal = serializer.save()
        
        # Deduct amount from wallet available balance
        # deduct_funds already creates the transaction record
        wallet = withdrawal.wallet
        wallet.deduct_funds(withdrawal.amount, reason='withdrawal_request')


class WithdrawalDetailView(generics.RetrieveAPIView):
    """Get withdrawal request details"""
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Withdrawal.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="get_withdrawal_detail",
        summary="Withdrawal Request Details",
        description="Get specific withdrawal request details",
        tags=["Withdrawals"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class BankAccountListView(generics.ListAPIView):
    """List user's bank accounts"""
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="list_bank_accounts",
        summary="List Bank Accounts",
        description="Get current user's bank accounts for withdrawals",
        tags=["Bank Accounts"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class BankAccountCreateView(generics.CreateAPIView):
    """Create new bank account for withdrawals"""
    serializer_class = BankAccountCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_bank_account",
        summary="Add Bank Account",
        description="Add a new bank account for withdrawals with KYC verification",
        tags=["Bank Accounts"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        bank_account = serializer.save()
        # Here you would integrate with KYC verification service
        # For now, we'll set it as pending verification
        bank_account.status = 'pending_verification'
        bank_account.save()


class BankAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Bank account details, update, and delete"""
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)
    
    @extend_schema(
        operation_id="get_bank_account_detail",
        summary="Bank Account Details",
        description="Get specific bank account details",
        tags=["Bank Accounts"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="update_bank_account",
        summary="Update Bank Account",
        description="Update bank account information",
        tags=["Bank Accounts"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @extend_schema(
        operation_id="delete_bank_account",
        summary="Delete Bank Account",
        description="Delete a bank account",
        tags=["Bank Accounts"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_bank_account(request, pk):
    """Verify bank account for KYC compliance"""
    try:
        bank_account = BankAccount.objects.get(pk=pk, user=request.user)
    except BankAccount.DoesNotExist:
        return Response(
            {'error': 'Bank account not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    if bank_account.status == 'verified':
        return Response(
            {'message': 'Bank account is already verified'},
            status=status.HTTP_200_OK
        )
    
    # Here you would integrate with KYC verification service
    # For demo purposes, we'll simulate verification
    bank_account.status = 'verified'
    bank_account.kyc_verified = True
    bank_account.kyc_verified_at = timezone.now()
    bank_account.save()
    
    return Response(
        {
            'message': 'Bank account verified successfully',
            'bank_account': BankAccountSerializer(bank_account).data
        },
        status=status.HTTP_200_OK
    )
