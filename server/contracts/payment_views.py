from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Contract
from .contract_payments import ContractPayment
from .serializers import ContractPaymentSerializer
from payments.models import Wallet


class ContractPaymentListView(generics.ListCreateAPIView):
    """
    List all payments for a contract or create a new payment request
    """
    serializer_class = ContractPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"POST request received for contract payments")
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request user: {request.user}")
        logger.info(f"URL kwargs: {kwargs}")
        
        return super().post(request, *args, **kwargs)
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        contract = get_object_or_404(Contract, id=contract_id)
        
        # Ensure user has access to this contract
        if self.request.user not in [contract.client, contract.professional]:
            return ContractPayment.objects.none()
        
        return ContractPayment.objects.filter(contract=contract)
    
    def get_serializer_context(self):
        """Add contract to serializer context for validation"""
        import logging
        logger = logging.getLogger(__name__)
        
        context = super().get_serializer_context()
        contract_id = self.kwargs.get('pk')
        
        logger.info(f"Getting serializer context for contract_id: {contract_id}")
        logger.info(f"URL kwargs: {self.kwargs}")
        
        if contract_id:
            try:
                contract = Contract.objects.get(id=contract_id)
                context['contract'] = contract
                logger.info(f"Contract found and added to context: {contract.id} - {contract.title}")
            except Contract.DoesNotExist:
                logger.error(f"Contract with id {contract_id} does not exist")
                pass
        else:
            logger.error("No contract_id found in kwargs")
            
        logger.info(f"Final context keys: {list(context.keys())}")
        return context
    
    def perform_create(self, serializer):
        """Set the contract and requesting user when creating a payment"""
        import logging
        logger = logging.getLogger(__name__)
        
        contract_id = self.kwargs.get('pk')
        contract = get_object_or_404(Contract, pk=contract_id)
        
        logger.info(f"Creating payment for contract {contract_id} by user {self.request.user.id}")
        logger.info(f"Payment data before save: {serializer.validated_data}")
        
        payment = serializer.save(
            contract=contract,
            requested_by=self.request.user
        )
        
        logger.info(f"Payment created successfully: ID {payment.id}, Status {payment.status}")


class ContractPaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific contract payment
    """
    serializer_class = ContractPaymentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'payment_id'
    
    def get_queryset(self):
        return ContractPayment.objects.all()
    
    def get_object(self):
        payment = super().get_object()
        
        # Ensure user has access to this payment
        if self.request.user not in [payment.contract.client, payment.contract.professional]:
            raise PermissionError("Access denied")
        
        return payment


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_payment(request, pk, payment_id):
    """
    Client approves a payment request
    """
    try:
        with transaction.atomic():
            payment = get_object_or_404(ContractPayment, id=payment_id)
            
            # Verify user is the client
            if request.user != payment.contract.client:
                return Response(
                    {'error': 'Only the contract client can approve payments'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            client_notes = request.data.get('notes', '')
            result = payment.approve_payment(request.user, client_notes)
            
            return Response({
                'success': True,
                'message': result['message'],
                'payment': ContractPaymentSerializer(payment).data,
                'transfer_details': {
                    'gross_amount': result['gross_amount'],
                    'net_amount': result['net_amount'],
                    'commission_amount': result['commission_amount'],
                    'available_date': result['available_date']
                }
            })
            
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'An error occurred while processing the payment'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_payment(request, pk, payment_id):
    """
    Cancel a payment request (by client or professional)
    """
    try:
        with transaction.atomic():
            payment = get_object_or_404(ContractPayment, id=payment_id)
            
            # Verify user has permission to cancel
            if request.user not in [payment.contract.client, payment.contract.professional]:
                return Response(
                    {'error': 'Access denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            reason = request.data.get('reason', '')
            result = payment.cancel_payment(request.user, reason)
            
            return Response({
                'success': True,
                'message': result['message'],
                'payment': ContractPaymentSerializer(payment).data
            })
            
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'An error occurred while cancelling the payment'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contract_balance_info(request, contract_id):
    """
    Get contract balance information for payment decisions
    """
    try:
        contract = get_object_or_404(Contract, id=contract_id)
        
        # Ensure user has access to this contract
        if request.user not in [contract.client, contract.professional]:
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get client wallet info
        client_wallet, created = Wallet.objects.get_or_create(user=contract.client)
        
        # Get professional wallet info
        professional_wallet, created = Wallet.objects.get_or_create(user=contract.professional)
        
        # Get pending payments
        pending_payments = ContractPayment.objects.filter(
            contract=contract,
            status='pending'
        )
        
        # Calculate pending payment amounts
        total_pending_amount = sum(p.amount for p in pending_payments)
        
        # Return flat structure that matches frontend expectations
        return Response({
            # Contract balance information - use available_contract_balance for payment validation
            'contract_balance': float(contract.available_contract_balance or 0),
            'contract_value': float(contract.total_amount or 0),
            'total_paid': float(contract.paid_amount or 0),
            
            # Client wallet information
            'client_pending_balance': float(client_wallet.pending_balance or 0),
            
            # Professional wallet information
            'professional_current_balance': float(professional_wallet.available_balance or 0),
            'professional_pending_balance': float(professional_wallet.pending_balance or 0),
            
            # Payment information
            'total_pending_payments': float(total_pending_amount or 0),
            
            # Permission flags - use available_contract_balance for validation
            'can_request_payment': (
                request.user == contract.professional and 
                contract.is_active() and 
                (contract.available_contract_balance or 0) > 0
            ),
            'can_approve_payment': (
                request.user == contract.client and 
                pending_payments.exists()
            )
        })
        
    except Exception as e:
        return Response(
            {'error': 'An error occurred while fetching balance information'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def allocate_funds_to_contract(request, contract_id):
    """
    Client allocates funds from their wallet to contract balance
    """
    try:
        with transaction.atomic():
            contract = get_object_or_404(Contract, id=contract_id)
            
            # Verify user is the client
            if request.user != contract.client:
                return Response(
                    {'error': 'Only the contract client can allocate funds'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            amount = request.data.get('amount')
            if not amount or float(amount) <= 0:
                return Response(
                    {'error': 'Valid amount is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            amount = float(amount)
            
            # Allocate funds using existing method
            success = contract.allocate_contract_funds(amount)
            
            if success:
                return Response({
                    'success': True,
                    'message': f'${amount} allocated to contract successfully',
                    'contract_balance': contract.contract_balance,
                    'available_contract_balance': contract.available_contract_balance
                })
            else:
                return Response(
                    {'error': 'Insufficient available balance in wallet'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
    except Exception as e:
        return Response(
            {'error': 'An error occurred while allocating funds'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def professional_pending_payments(request):
    """
    Get professional's pending payments that will become available
    """
    try:
        # Get all transferred payments for this professional
        transferred_payments = ContractPayment.objects.filter(
            contract__professional=request.user,
            status='transferred'
        ).select_related('contract')
        
        # Separate available and pending
        available_payments = []
        pending_payments = []
        
        for payment in transferred_payments:
            if payment.is_available_to_professional:
                available_payments.append(payment)
            else:
                pending_payments.append(payment)
        
        return Response({
            'pending_payments': ContractPaymentSerializer(pending_payments, many=True).data,
            'available_payments': ContractPaymentSerializer(available_payments, many=True).data,
            'summary': {
                'total_pending_amount': sum(p.net_amount_to_professional for p in pending_payments),
                'total_available_amount': sum(p.net_amount_to_professional for p in available_payments),
                'pending_count': len(pending_payments),
                'available_count': len(available_payments)
            }
        })
        
    except Exception as e:
        return Response(
            {'error': 'An error occurred while fetching pending payments'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_available_payments(request):
    """
    Complete all available payments (move from pending to available balance)
    """
    try:
        with transaction.atomic():
            # Get all available payments for this professional
            available_payments = ContractPayment.objects.filter(
                contract__professional=request.user,
                status='transferred'
            )
            
            completed_payments = []
            total_completed_amount = 0
            
            for payment in available_payments:
                if payment.is_available_to_professional:
                    result = payment.complete_payment()
                    if result['success']:
                        completed_payments.append(payment)
                        total_completed_amount += payment.net_amount_to_professional
            
            return Response({
                'success': True,
                'message': f'{len(completed_payments)} payments completed',
                'completed_payments': ContractPaymentSerializer(completed_payments, many=True).data,
                'total_amount': total_completed_amount
            })
            
    except Exception as e:
        return Response(
            {'error': 'An error occurred while completing payments'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )