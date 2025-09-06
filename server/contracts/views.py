from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Sum, Count
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from .models import Contract, ContractMilestone, ContractDocument, ContractLocation, ContractCalendarEvent, ContractInstallment
from .serializers import (
    ContractSerializer, ContractDetailSerializer, ContractMilestoneSerializer,
    ContractDocumentSerializer, ContractLocationSerializer, ContractCalendarEventSerializer,
    ContractInstallmentSerializer
)
# Import location services
from location_services.models import UserLocation, Address
from location_services.serializers import UserLocationSerializer
# Import calendar services
from calendar_app.models import Appointment
from calendar_app.serializers import AppointmentSerializer
# Import payments for contract termination
from payments.models import Payment, Wallet, WalletTransaction
from payments.serializers import PaymentSerializer
from decimal import Decimal


class ContractListView(generics.ListAPIView):
    """قائمة العقود"""
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            Q(client=user) | Q(professional=user)
        )


class ContractDetailView(generics.RetrieveAPIView):
    """تفاصيل العقد"""
    serializer_class = ContractDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            Q(client=user) | Q(professional=user)
        )


class ContractCreateView(generics.CreateAPIView):
    """إنشاء عقد جديد"""
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        contract = serializer.save(client=self.request.user)
        
        # Handle temporary contract and escrow account if exists
        self._handle_temporary_contract_and_escrow(contract)
    
    def _handle_temporary_contract_and_escrow(self, new_contract):
        """Handle temporary contract and escrow account when creating a new contract"""
        from payments.models import EscrowAccount, Payment
        
        try:
            print(f"\n=== HANDLING TEMPORARY CONTRACT AND ESCROW ===")
            print(f"New contract: {new_contract.id} for project: {new_contract.project.id}")
            print(f"Professional: {new_contract.professional}")
            
            # Find temporary contract for this project (where professional is the client)
            temp_contract = Contract.objects.filter(
                project=new_contract.project,
                professional=new_contract.client,  # Temporary contract has professional set to client
                status='draft'
            ).first()
            
            if temp_contract:
                print(f"Found temporary contract: {temp_contract.id}")
                
                # Find associated escrow account
                temp_escrow = EscrowAccount.objects.filter(
                    contract=temp_contract,
                    client=new_contract.client,
                    professional=new_contract.client,  # Temporary escrow has professional set to client
                    status='funded'
                ).first()
                
                if temp_escrow:
                    print(f"Found temporary escrow: {temp_escrow.escrow_id}")
                    print(f"Escrow amount: {temp_escrow.amount}")
                    
                    # Update escrow to point to new contract and professional
                    temp_escrow.contract = new_contract
                    temp_escrow.professional = new_contract.professional
                    temp_escrow.metadata = temp_escrow.metadata or {}
                    temp_escrow.metadata.update({
                        'updated_from_temporary': True,
                        'original_temp_contract_id': temp_contract.id,
                        'updated_at': timezone.now().isoformat()
                    })
                    temp_escrow.save()
                    print(f"Updated escrow to point to new contract and professional")
                    
                    # Update payment records associated with this escrow
                    Payment.objects.filter(
                        escrow_account=temp_escrow
                    ).update(
                        professional=new_contract.professional,
                        contract=new_contract
                    )
                    print(f"Updated payment records")
                    
                    # Delete temporary contract
                    temp_contract.delete()
                    print(f"Deleted temporary contract: {temp_contract.id}")
                    
                else:
                    print("No temporary escrow found")
            else:
                print("No temporary contract found")
                
        except Exception as e:
            print(f"Error handling temporary contract and escrow: {str(e)}")
            # Don't raise the exception to avoid breaking contract creation
            pass


class ContractUpdateView(generics.UpdateAPIView):
    """تحديث العقد"""
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            Q(client=user) | Q(professional=user)
        )
    
    def update(self, request, *args, **kwargs):
        """Override update method with detailed error logging"""
        try:
            print(f"\n=== CONTRACT UPDATE DEBUG ===")
            print(f"Request method: {request.method}")
            print(f"Request path: {request.path}")
            print(f"Request data: {request.data}")
            print(f"Contract ID: {kwargs.get('pk')}")
            print(f"User: {request.user}")
            print(f"User authenticated: {request.user.is_authenticated}")
            print(f"User type: {getattr(request.user, 'user_type', 'N/A')}")
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                print("ERROR: User not authenticated")
                return Response(
                    {'error': 'Authentication required'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Try to get the object
            try:
                instance = self.get_object()
                print(f"Found contract instance: {instance}")
                print(f"Contract client: {instance.client}")
                print(f"Contract professional: {instance.professional}")
            except Exception as get_obj_error:
                print(f"ERROR getting object: {str(get_obj_error)}")
                return Response(
                    {'error': f'Contract not found: {str(get_obj_error)}'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check permissions
            if request.user != instance.client and request.user != instance.professional:
                print(f"ERROR: User {request.user} not authorized for contract {instance}")
                return Response(
                    {'error': 'Not authorized to update this contract'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            
            if not serializer.is_valid():
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            self.perform_update(serializer)
            print(f"Contract updated successfully")
            print(f"=== END CONTRACT UPDATE DEBUG ===\n")
            return Response(serializer.data)
            
        except Exception as e:
            print(f"Contract update error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Update failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneRejectPaymentView(APIView):
    """رفض دفع معلم"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="reject_milestone_payment",
        summary="رفض دفع معلم",
        description="رفض دفع معلم من قبل العميل",
        tags=["Milestones"],
        request={
            'type': 'object',
            'properties': {
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            }
        }
    )
    def post(self, request, pk, milestone_id):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            # Check if milestone payment can be rejected
            if milestone.payment_status != 'requested':
                return Response(
                    {'error': 'Payment can only be rejected when it is requested'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update milestone payment status
            milestone.payment_status = 'rejected'
            milestone.payment_notes = request.data.get('notes', '')
            milestone.save()
            
            return Response({
                'message': 'Payment rejected successfully',
                'milestone_id': milestone.id,
                'payment_status': milestone.payment_status,
                'notes': milestone.payment_notes
            })
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                 {'error': f'Failed to reject payment: {str(e)}'},
                 status=status.HTTP_400_BAD_REQUEST
             )


class PaymentReportExportView(APIView):
    """تصدير تقارير الدفع"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="export_payment_report",
        summary="تصدير تقرير الدفعات",
        description="تصدير تقرير شامل للدفعات بصيغ مختلفة",
        tags=["Reports"],
        request={
            'type': 'object',
            'properties': {
                'start_date': {
                    'type': 'string',
                    'format': 'date',
                    'description': 'تاريخ البداية'
                },
                'end_date': {
                    'type': 'string',
                    'format': 'date',
                    'description': 'تاريخ النهاية'
                },
                'status': {
                    'type': 'string',
                    'enum': ['all', 'pending', 'approved', 'processed', 'rejected', 'held', 'completed'],
                    'description': 'حالة الدفع'
                },
                'format': {
                    'type': 'string',
                    'enum': ['json', 'csv', 'excel'],
                    'description': 'صيغة التصدير'
                },
                'include_details': {
                    'type': 'boolean',
                    'description': 'تضمين التفاصيل'
                },
                'contract_id': {
                    'type': 'string',
                    'format': 'uuid',
                    'description': 'معرف العقد المحدد'
                },
                'payment_type': {
                    'type': 'string',
                    'enum': ['all', 'milestone', 'full_payment', 'partial'],
                    'description': 'نوع الدفع'
                }
            }
        }
    )
    def post(self, request):
        try:
            from payments.models import Payment, WalletTransaction
            import csv
            import json
            from django.http import HttpResponse
            from datetime import datetime
            
            # Get filter parameters
            start_date = request.data.get('start_date')
            end_date = request.data.get('end_date')
            payment_status = request.data.get('status', 'all')
            export_format = request.data.get('format', 'json')
            include_details = request.data.get('include_details', True)
            contract_id = request.data.get('contract_id')
            payment_type = request.data.get('payment_type', 'all')
            
            # Get user's contracts
            if hasattr(request.user, 'professional_profile'):
                contracts = Contract.objects.filter(professional=request.user)
                user_role = 'professional'
            else:
                contracts = Contract.objects.filter(client=request.user)
                user_role = 'client'
            
            # Filter by specific contract if provided
            if contract_id:
                contracts = contracts.filter(id=contract_id)
            
            # Get payments related to user's contracts
            payments = Payment.objects.filter(
                Q(milestone__contract__in=contracts) | Q(contract__in=contracts)
            ).select_related('milestone', 'contract', 'payer', 'recipient')
            
            # Apply date filters
            if start_date:
                try:
                    start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                    payments = payments.filter(created_at__date__gte=start_date_obj)
                except ValueError:
                    pass
            
            if end_date:
                try:
                    end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                    payments = payments.filter(created_at__date__lte=end_date_obj)
                except ValueError:
                    pass
            
            # Apply status filter
            if payment_status != 'all':
                payments = payments.filter(status=payment_status)
            
            # Apply payment type filter
            if payment_type != 'all':
                if payment_type == 'milestone':
                    payments = payments.filter(milestone__isnull=False)
                elif payment_type == 'full_payment':
                    payments = payments.filter(milestone__isnull=True)
            
            # Prepare report data
            report_data = []
            total_amount = 0
            
            for payment in payments:
                payment_data = {
                    'payment_id': str(payment.id),
                    'contract_id': str(payment.contract.id),
                    'contract_title': payment.contract.title,
                    'amount': float(payment.amount),
                    'status': payment.status,
                    'payment_method': payment.payment_method,
                    'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'completed_at': payment.completed_at.strftime('%Y-%m-%d %H:%M:%S') if payment.completed_at else None,
                }
                
                # Add milestone info if exists
                if payment.milestone:
                    payment_data.update({
                        'milestone_id': str(payment.milestone.id),
                        'milestone_title': payment.milestone.title,
                        'milestone_status': payment.milestone.status,
                    })
                
                if include_details:
                    payment_data.update({
                        'payer_name': payment.payer.get_full_name() if payment.payer else 'N/A',
                        'recipient_name': payment.recipient.get_full_name() if payment.recipient else 'N/A',
                        'description': payment.description or '',
                        'transaction_id': payment.transaction_id or '',
                        'fees': float(payment.fees) if payment.fees else 0,
                        'net_amount': float(payment.amount - (payment.fees or 0)),
                    })
                
                report_data.append(payment_data)
                total_amount += payment.amount
            
            # Generate summary statistics
            summary = {
                'total_records': len(report_data),
                'total_amount': float(total_amount),
                'user_role': user_role,
                'export_timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
                'filters_applied': {
                    'start_date': start_date,
                    'end_date': end_date,
                    'status': payment_status,
                    'contract_id': contract_id,
                    'payment_type': payment_type,
                    'include_details': include_details
                },
                'status_breakdown': {}
            }
            
            # Calculate status breakdown
            for payment in payments:
                status_key = payment.status
                if status_key in summary['status_breakdown']:
                    summary['status_breakdown'][status_key] += 1
                else:
                    summary['status_breakdown'][status_key] = 1
            
            # Return data based on format
            if export_format == 'json':
                return Response({
                    'success': True,
                    'message': 'Payment report generated successfully',
                    'summary': summary,
                    'data': report_data
                })
            
            elif export_format == 'csv':
                response = HttpResponse(content_type='text/csv')
                response['Content-Disposition'] = f'attachment; filename="payment_report_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
                
                if report_data:
                    writer = csv.DictWriter(response, fieldnames=report_data[0].keys())
                    writer.writeheader()
                    writer.writerows(report_data)
                
                return response
            
            else:  # Default to JSON if unsupported format
                return Response({
                    'success': True,
                    'message': f'Export format {export_format} not fully implemented, returning JSON',
                    'summary': summary,
                    'data': report_data
                })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to export payment report: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_update(self, serializer):
        """Custom update logic"""
        contract = serializer.save()
        
        # Update project status when contract status changes to completed
        if 'status' in serializer.validated_data:
            new_status = serializer.validated_data['status']
            if new_status == 'completed' and contract.project:
                # Update the related project status to completed
                contract.project.status = 'completed'
                contract.project.completion_percentage = 100
                contract.project.save()
                print(f"Project {contract.project.id} status updated to completed")
            elif new_status in ['cancelled', 'disputed'] and contract.project:
                # Update project status based on contract status
                if new_status == 'cancelled':
                    contract.project.status = 'cancelled'
                elif new_status == 'disputed':
                    contract.project.status = 'paused'
                contract.project.save()
                print(f"Project {contract.project.id} status updated to {contract.project.status}")


class ContractSignView(APIView):
    """توقيع العقد"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContractSerializer
    
    @extend_schema(
        operation_id="sign_contract",
        summary="توقيع العقد",
        description="توقيع العقد من قبل العميل أو المحترف",
        tags=["Contracts"],
        request={
            'type': 'object',
            'properties': {}
        }
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(pk=pk)
            user = request.user
            
            if user == contract.client:
                contract.client_signed = True
                contract.client_signed_date = timezone.now()
            elif user == contract.professional:
                contract.professional_signed = True
                contract.professional_signed_date = timezone.now()
            else:
                return Response(
                    {'error': 'Not authorized to sign this contract'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            contract.save()
            return Response({'message': 'Contract signed successfully'})
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ContractMilestoneListView(generics.ListCreateAPIView):
    """قائمة وإنشاء مراحل العقد"""
    serializer_class = ContractMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        user = self.request.user
        return ContractMilestone.objects.filter(
            contract_id=contract_id,
            contract__in=Contract.objects.filter(
                Q(client=user) | Q(professional=user)
            )
        )
    
    def perform_create(self, serializer):
        contract_id = self.kwargs.get('pk')
        user = self.request.user
        
        # Get the contract
        try:
            contract = Contract.objects.get(
                id=contract_id,
                **{Q(client=user) | Q(professional=user): True}
            )
        except Contract.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Contract not found")
        
        # Validate milestone amount against contract total
        milestone_amount = serializer.validated_data.get('amount', 0)
        existing_milestones_total = ContractMilestone.objects.filter(
            contract=contract
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        new_total = existing_milestones_total + milestone_amount
        
        # Check if new total exceeds contract total amount
        if new_total > contract.total_amount:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({
                'amount': f'Total milestone amount ({new_total}) cannot exceed contract total amount ({contract.total_amount}). Current milestones total: {existing_milestones_total}'
            })
        
        # Save the milestone
        serializer.save(contract=contract)


class ContractDocumentListView(generics.ListAPIView):
    """قائمة مستندات العقد"""
    serializer_class = ContractDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        user = self.request.user
        return ContractDocument.objects.filter(
            contract_id=contract_id,
            contract__in=Contract.objects.filter(
                Q(client=user) | Q(professional=user)
            )
        )


class ClientContractListView(generics.ListAPIView):
    """قائمة عقود العميل"""
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Contract.objects.filter(client=self.request.user)


class ProfessionalContractListView(generics.ListAPIView):
    """قائمة عقود المحترف"""
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Contract.objects.filter(professional=self.request.user)


# Contract Amendments Views (Appointments)
class ContractAmendmentListView(generics.ListCreateAPIView):
    """Contract Appointments List - Connected to Calendar App"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        # Get appointments from calendar_app for this contract
        return Appointment.objects.filter(
            project__contracts__id=contract_id
        ).select_related('professional', 'client', 'project')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = AppointmentSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        contract_id = self.kwargs.get('pk')
        try:
            contract = Contract.objects.get(pk=contract_id)
            
            # Create appointment in calendar_app
            appointment_data = {
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'professional': contract.professional.id,
                'client': contract.client.id,
                'project': contract.project.id,
                'date': request.data.get('appointment_date'),
                'time': request.data.get('start_time'),
                'duration': self._calculate_duration(
                    request.data.get('start_time'),
                    request.data.get('end_time')
                ),
                'location': request.data.get('location'),
                'type': 'consultation',
                'status': 'scheduled'
            }
            
            serializer = AppointmentSerializer(data=appointment_data)
            if serializer.is_valid():
                appointment = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _calculate_duration(self, start_time, end_time):
        """Calculate duration in minutes between start and end time"""
        if not start_time or not end_time:
            return 60  # Default 1 hour
        
        try:
            from datetime import datetime
            start = datetime.strptime(start_time, '%H:%M')
            end = datetime.strptime(end_time, '%H:%M')
            duration = (end - start).total_seconds() / 60
            return max(15, int(duration))  # Minimum 15 minutes
        except:
            return 60


# Contract Locations Views  
class ContractLocationListView(generics.ListCreateAPIView):
    """قائمة مواقع العقد"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContractLocationSerializer
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        return ContractLocation.objects.filter(contract_id=contract_id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        contract_id = self.kwargs.get('pk')
        try:
            contract = Contract.objects.get(pk=contract_id)
            # Add contract context to request
            request.data['contract'] = contract_id
            return super().create(request, *args, **kwargs)
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ContractLocationDetailView(generics.RetrieveAPIView):
    """تفاصيل موقع العقد"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContractLocationSerializer
    
    def get_queryset(self):
        return ContractLocation.objects.all()


class ContractLocationUpdateView(generics.UpdateAPIView):
    """تحديث موقع العقد"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContractLocationSerializer
    
    def get_queryset(self):
        return ContractLocation.objects.all()


class ContractLocationDeleteView(generics.DestroyAPIView):
    """حذف موقع العقد"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ContractLocation.objects.all()


class ContractLocationSetPrimaryView(APIView):
    """تعيين موقع العقد كموقع رئيسي"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            location = ContractLocation.objects.get(pk=pk)
            # Set all other locations in the same contract as non-primary
            ContractLocation.objects.filter(contract=location.contract).update(is_primary=False)
            # Set this location as primary
            location.is_primary = True
            location.save()
            serializer = ContractLocationSerializer(location)
            return Response(serializer.data)
        except ContractLocation.DoesNotExist:
            return Response(
                {'error': 'Location not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# Contract Calendar Events Views
class ContractCalendarEventListView(generics.ListCreateAPIView):
    """قائمة أحداث تقويم العقد (المواعيد)"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContractCalendarEventSerializer
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        return ContractCalendarEvent.objects.filter(contract_id=contract_id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        contract_id = self.kwargs.get('pk')
        try:
            contract = Contract.objects.get(pk=contract_id)
            # Add contract context to request
            request.data['contract'] = contract_id
            return super().create(request, *args, **kwargs)
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ContractStatsView(APIView):
    """إحصائيات العقود"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="get_contract_stats",
        summary="إحصائيات العقود",
        description="الحصول على إحصائيات العقود للمستخدم الحالي",
        tags=["Contracts"]
    )
    def get(self, request):
        user = request.user
        
        # Get user's contracts (both as client and professional)
        user_contracts = Contract.objects.filter(
            Q(client=user) | Q(professional=user)
        )
        
        # Calculate statistics
        total_contracts = user_contracts.count()
        active_contracts = user_contracts.filter(status='active').count()
        completed_contracts = user_contracts.filter(status='completed').count()
        
        # Calculate financial statistics
        total_value = user_contracts.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        paid_amount = user_contracts.aggregate(
            paid=Sum('paid_amount')
        )['paid'] or 0
        
        pending_amount = total_value - paid_amount
        
        # Calculate completion rate
        completion_rate = 0
        if total_contracts > 0:
            completion_rate = (completed_contracts / total_contracts) * 100
        
        return Response({
            'total_contracts': total_contracts,
            'active_contracts': active_contracts,
            'completed_contracts': completed_contracts,
            'total_value': float(total_value),
            'paid_amount': float(paid_amount),
            'pending_amount': float(pending_amount),
            'completion_rate': round(completion_rate, 2)
        })


class ContractTerminateView(APIView):
    """إنهاء العقد وتحويل الأموال للمحترف"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="terminate_contract",
        summary="إنهاء العقد",
        description="إنهاء العقد من قبل العميل مع تحويل الأموال المتبقية للمحترف",
        tags=["Contracts"],
        request={
            'type': 'object',
            'properties': {
                'reason': {
                    'type': 'string',
                    'description': 'سبب إنهاء العقد'
                }
            }
        }
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(pk=pk)
            user = request.user
            
            # Only client can terminate contract
            if user != contract.client:
                return Response(
                    {'error': 'Only the client can terminate this contract'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if contract is already terminated
            if contract.status == 'terminated':
                return Response(
                    {'error': 'Contract is already terminated'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate remaining amount
            total_paid = contract.paid_amount or 0
            total_amount = contract.total_amount or 0
            remaining_amount = total_amount - total_paid
            
            # Create payment to professional for remaining amount
            if remaining_amount > 0:
                payment_data = {
                    'amount': remaining_amount,
                    'payment_type': 'contract_termination',
                    'status': 'completed',
                    'payer': contract.client,
                    'payee': contract.professional,
                    'contract': contract,
                    'description': f'Contract termination payment - Contract #{contract.contract_number}',
                    'notes': request.data.get('reason', 'Contract terminated by client')
                }
                
                payment = Payment.objects.create(**payment_data)
                
                # Update contract
                contract.status = 'terminated'
                contract.actual_end_date = timezone.now()
                contract.paid_amount = total_amount  # Mark as fully paid
                contract.save()
                
                return Response({
                    'message': 'Contract terminated successfully',
                    'payment_id': payment.id,
                    'amount_transferred': remaining_amount,
                    'contract_status': contract.status
                })
            else:
                # No remaining amount to transfer
                contract.status = 'terminated'
                contract.actual_end_date = timezone.now()
                contract.save()
                
                return Response({
                    'message': 'Contract terminated successfully',
                    'amount_transferred': 0,
                    'contract_status': contract.status
                })
                
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to terminate contract: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ContractAllocateFundsView(APIView):
    """تخصيص الأموال للمشروع من محفظة العميل"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="allocate_contract_funds",
        summary="تخصيص أموال للعقد",
        description="تحويل الأموال من محفظة العميل إلى رصيد المشروع",
        tags=["Contracts"],
        request={
            'type': 'object',
            'properties': {
                'amount': {
                    'type': 'number',
                    'description': 'المبلغ المراد تخصيصه'
                }
            },
            'required': ['amount']
        }
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            amount = Decimal(str(request.data.get('amount', 0)))
            
            if amount <= 0:
                return Response(
                    {'error': 'Amount must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get client wallet
            client_wallet = Wallet.objects.get(user=request.user)
            
            # Check if client has sufficient balance
            if client_wallet.available_balance < amount:
                return Response(
                    {'error': 'Insufficient wallet balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Move funds from available to pending balance
            client_wallet.available_balance -= amount
            client_wallet.pending_balance += amount
            client_wallet.save()
            
            # Create wallet transaction
            WalletTransaction.objects.create(
                wallet=client_wallet,
                amount=-amount,
                transaction_type='debit',
                source='project_allocation',
                description=f'Funds allocated to contract {contract.contract_number}'
            )
            
            # Allocate funds to contract
            contract.allocate_contract_funds(amount)
            
            return Response({
                'message': 'Funds allocated successfully',
                'contract_id': contract.id,
                'allocated_amount': amount,
                'contract_balance': contract.contract_balance,
                'contract_status': contract.status,
                'client_available_balance': client_wallet.available_balance,
                'client_pending_balance': client_wallet.pending_balance
            })
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Wallet.DoesNotExist:
            return Response(
                {'error': 'Wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to allocate funds: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ContractCompleteView(APIView):
    """إكمال العقد وتحويل الأموال المتبقية للمحترف"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="complete_contract",
        summary="إكمال العقد",
        description="إكمال العقد وتحويل الأموال المتبقية للمحترف بعد خصم العمولة",
        tags=["Contracts"]
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            
            if contract.status != 'active':
                return Response(
                    {'error': 'Contract must be active to complete'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Complete contract and get transfer details
            transfer_details = contract.complete_contract()
            
            return Response({
                'message': 'Contract completed successfully',
                'contract_id': contract.id,
                'transferred_amount': transfer_details['remaining_balance'],
                'net_amount_to_professional': transfer_details['net_amount_to_professional'],
                'platform_commission': transfer_details['remaining_balance'] * contract.platform_commission_rate if transfer_details['remaining_balance'] > 0 else 0,
                'contract_status': contract.status
            })
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to complete contract: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneRequestPaymentView(APIView):
    """طلب دفع معلم من قبل المحترف"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="request_milestone_payment",
        summary="طلب دفع معلم",
        description="طلب دفع معلم من قبل المحترف",
        tags=["Milestones"],
        request={
            'type': 'object',
            'properties': {
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            }
        }
    )
    def post(self, request, pk, milestone_id):
        try:
            contract = Contract.objects.get(pk=pk, professional=request.user)
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            notes = request.data.get('notes', '')
            result = milestone.request_payment(notes)
            
            if result['success']:
                return Response({
                    'message': 'Payment request submitted successfully',
                    'milestone_id': milestone.id,
                    'payment_status': milestone.payment_status,
                    'requested_at': milestone.payment_requested_at
                })
            else:
                return Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to request payment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneApprovePaymentView(APIView):
    """الموافقة على دفع معلم من قبل العميل"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="approve_milestone_payment",
        summary="الموافقة على دفع معلم",
        description="الموافقة على دفع معلم من قبل العميل",
        tags=["Milestones"],
        request={
            'type': 'object',
            'properties': {
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            }
        }
    )
    def post(self, request, pk, milestone_id):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            notes = request.data.get('notes', '')
            result = milestone.approve_payment(notes)
            
            if result['success']:
                return Response({
                    'message': 'Payment approved successfully',
                    'milestone_id': milestone.id,
                    'payment_status': milestone.payment_status,
                    'approved_at': milestone.payment_approved_at
                })
            else:
                return Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to approve payment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneProcessPaymentView(APIView):
    """معالجة دفع معلم وتحويل الأموال من رصيد العقد"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="process_milestone_payment",
        summary="معالجة دفع معلم",
        description="معالجة دفع معلم وتحويل الأموال من رصيد العقد للمحترف",
        tags=["Milestones"]
    )
    def post(self, request, pk, milestone_id):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            # Check if milestone payment is approved
            if milestone.payment_status != 'approved':
                return Response(
                    {'error': 'Milestone payment must be approved first'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if contract has sufficient balance
            if not contract.has_sufficient_contract_balance(milestone.amount):
                return Response(
                    {'error': 'Insufficient funds in contract balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Use the contract's transfer method
            try:
                result = contract.transfer_to_professional_balance(milestone.amount)
                
                # Update milestone status
                milestone.payment_status = 'paid'
                milestone.status = 'paid'
                milestone.payment_date = timezone.now().date()
                milestone.save()
                
                # Update contract paid amount
                contract.paid_amount += milestone.amount
                contract.save()
                
                return Response({
                    'message': 'Payment processed successfully',
                    'milestone_id': milestone.id,
                    'payment_status': milestone.payment_status,
                    'amount': milestone.amount,
                    'net_amount_to_professional': result['net_amount'],
                    'platform_commission': result['commission'],
                    'contract_balance_remaining': contract.available_contract_balance
                })
                
            except Exception as e:
                return Response(
                    {'error': f'Failed to process payment: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to process payment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneAcceptPaymentView(APIView):
    """قبول دفع معلم من قبل العميل وتحويل الأموال من رصيد العقد"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="accept_milestone_payment",
        summary="قبول دفع معلم",
        description="قبول دفع معلم من قبل العميل وتحويل الأموال من رصيد العقد",
        tags=["Milestones"],
        request={
            'type': 'object',
            'properties': {
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            }
        }
    )
    def post(self, request, pk, milestone_id):
        try:
            contract = Contract.objects.get(pk=pk, client=request.user)
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            # Check if milestone is in correct status
            if milestone.status not in ['completed', 'in_progress']:
                return Response(
                    {'error': 'Milestone must be completed or in progress to accept payment'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if contract has sufficient balance
            if not contract.has_sufficient_contract_balance(milestone.amount):
                return Response(
                    {'error': 'Insufficient funds in contract balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Use the contract's accept milestone payment method
            try:
                result = contract.accept_milestone_payment(milestone)
                
                # Add notes if provided
                notes = request.data.get('notes', '')
                if notes:
                    milestone.payment_notes += f"\n\nAcceptance notes: {notes}"
                    milestone.save()
                
                return Response({
                    'message': 'Payment accepted successfully',
                    'milestone_id': milestone.id,
                    'status': milestone.status,
                    'payment_status': milestone.payment_status,
                    'amount': milestone.amount,
                    'net_amount_to_professional': result['net_amount'],
                    'platform_commission': result['commission'],
                    'contract_balance_remaining': contract.available_contract_balance
                })
                
            except Exception as e:
                return Response(
                    {'error': f'Failed to accept payment: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to accept payment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class MilestoneCancelView(APIView):
    """إلغاء معلم"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="cancel_milestone",
        summary="إلغاء معلم",
        description="إلغاء معلم من قبل العميل أو المحترف",
        tags=["Milestones"],
        request={
            'type': 'object',
            'properties': {
                'notes': {
                    'type': 'string',
                    'description': 'ملاحظات إضافية'
                }
            }
        }
    )
    def post(self, request, pk, milestone_id):
        try:
            # Allow both client and professional to cancel
            contract = Contract.objects.filter(
                pk=pk
            ).filter(
                Q(client=request.user) | Q(professional=request.user)
            ).first()
            
            if not contract:
                return Response(
                    {'error': 'Contract not found or access denied'},
                    status=status.HTTP_404_NOT_FOUND
                )
            milestone = ContractMilestone.objects.get(
                id=milestone_id, 
                contract=contract
            )
            
            notes = request.data.get('notes', '')
            result = milestone.cancel_milestone(notes)
            
            if result['success']:
                return Response({
                    'message': result['message'],
                    'milestone_id': milestone.id,
                    'status': milestone.status,
                    'payment_status': milestone.payment_status
                })
            else:
                return Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to cancel milestone: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ReleasePendingFundsView(APIView):
    """تحويل الأموال من الرصيد المعلق إلى الرصيد المتاح بعد انتهاء فترة الـ 3 أيام"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="release_pending_funds",
        summary="تحويل الأموال المعلقة",
        description="تحويل الأموال من الرصيد المعلق إلى الرصيد المتاح بعد انتهاء فترة الـ 3 أيام",
        tags=["Payments"]
    )
    def post(self, request):
        try:
            from payments.models import Wallet, WalletTransaction
            from datetime import timedelta
            
            # Get user's wallet
            wallet = Wallet.objects.get(user=request.user)
            
            # Find transactions that are older than 3 days and still pending
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
                # Move from pending to available balance
                wallet.pending_balance -= transaction.amount
                wallet.available_balance += transaction.amount
                total_released += transaction.amount
                released_count += 1
                
                # Update transaction description to mark as released
                transaction.description = transaction.description.replace(
                    '(3-day hold period)', 
                    '(released to available balance)'
                )
                transaction.save()
            
            wallet.save()
            
            return Response({
                'message': f'Successfully released {released_count} pending transactions',
                'total_amount_released': total_released,
                'transactions_released': released_count,
                'current_available_balance': wallet.available_balance,
                'current_pending_balance': wallet.pending_balance
            })
            
        except Wallet.DoesNotExist:
            return Response(
                {'error': 'Wallet not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to release pending funds: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ConfirmWorkReceiptView(APIView):
    """تأكيد استلام العمل من العميل"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        request={
            'type': 'object',
            'properties': {
                'milestone_id': {'type': 'string', 'format': 'uuid'},
                'satisfaction_rating': {'type': 'integer', 'minimum': 1, 'maximum': 5},
                'feedback': {'type': 'string'},
                'confirm_receipt': {'type': 'boolean'}
            },
            'required': ['milestone_id', 'confirm_receipt']
        },
        responses={200: {'description': 'Work receipt confirmed successfully'}}
    )
    def post(self, request):
        try:
            milestone_id = request.data.get('milestone_id')
            satisfaction_rating = request.data.get('satisfaction_rating')
            feedback = request.data.get('feedback', '')
            confirm_receipt = request.data.get('confirm_receipt', False)
            
            if not milestone_id:
                return Response(
                    {'error': 'Milestone ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            milestone = ContractMilestone.objects.get(
                id=milestone_id,
                contract__client=request.user,
                status='completed'
            )
            
            if not confirm_receipt:
                return Response(
                    {'error': 'Work receipt confirmation is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update milestone status to accepted
            milestone.status = 'accepted'
            milestone.client_feedback = feedback
            milestone.client_rating = satisfaction_rating
            milestone.accepted_at = timezone.now()
            milestone.save()
            
            # Trigger automatic payment release
            from payments.models import Payment
            try:
                payment = Payment.objects.get(
                    milestone=milestone,
                    status='held'
                )
                payment.status = 'completed'
                payment.completed_at = timezone.now()
                payment.save()
                
                # Add to professional's wallet
                from payments.models import Wallet, WalletTransaction
                wallet, created = Wallet.objects.get_or_create(
                    user=milestone.contract.professional
                )
                
                # Add to available balance immediately since client confirmed
                wallet.available_balance += payment.amount
                wallet.save()
                
                # Create transaction record
                WalletTransaction.objects.create(
                    wallet=wallet,
                    amount=payment.amount,
                    transaction_type='credit',
                    source='milestone_payment',
                    description=f'Payment for milestone: {milestone.title} (client confirmed receipt)',
                    reference_id=str(payment.id)
                )
                
            except Payment.DoesNotExist:
                pass
            
            return Response({
                'message': 'Work receipt confirmed successfully',
                'milestone_id': str(milestone.id),
                'status': milestone.status,
                'payment_released': True
            })
            
        except ContractMilestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found or not accessible'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to confirm work receipt: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class RaiseDisputeView(APIView):
    """رفع نزاع على مرحلة أو عقد"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        request={
            'type': 'object',
            'properties': {
                'contract_id': {'type': 'string', 'format': 'uuid'},
                'milestone_id': {'type': 'string', 'format': 'uuid'},
                'dispute_type': {'type': 'string', 'enum': ['payment', 'quality', 'delivery', 'communication', 'contract_breach', 'other']},
                'title': {'type': 'string'},
                'description': {'type': 'string'},
                'disputed_amount': {'type': 'number'},
                'priority': {'type': 'string', 'enum': ['low', 'medium', 'high', 'urgent']}
            },
            'required': ['title', 'description', 'dispute_type']
        },
        responses={201: {'description': 'Dispute raised successfully'}}
    )
    def post(self, request):
        try:
            from disputes.models import Dispute
            
            contract_id = request.data.get('contract_id')
            milestone_id = request.data.get('milestone_id')
            dispute_type = request.data.get('dispute_type')
            title = request.data.get('title')
            description = request.data.get('description')
            disputed_amount = request.data.get('disputed_amount')
            priority = request.data.get('priority', 'medium')
            
            if not all([title, description, dispute_type]):
                return Response(
                    {'error': 'Title, description, and dispute type are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate contract access
            contract = None
            milestone = None
            against_user = None
            
            if contract_id:
                contract = Contract.objects.filter(
                    id=contract_id
                ).filter(
                    Q(client=request.user) | Q(professional=request.user)
                ).first()
                if not contract:
                    return Response(
                        {'error': 'Contract not found or access denied'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                against_user = contract.professional if contract.client == request.user else contract.client
            
            if milestone_id:
                milestone = ContractMilestone.objects.filter(
                    id=milestone_id
                ).filter(
                    Q(contract__client=request.user) | Q(contract__professional=request.user)
                ).first()
                if not milestone:
                    return Response(
                        {'error': 'Milestone not found or access denied'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                contract = milestone.contract
                against_user = contract.professional if contract.client == request.user else contract.client
            
            if not contract:
                return Response(
                    {'error': 'Contract or milestone must be specified'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create dispute
            dispute = Dispute.objects.create(
                title=title,
                description=description,
                dispute_type=dispute_type,
                priority=priority,
                raised_by=request.user,
                against=against_user,
                contract=contract,
                milestone=milestone,
                disputed_amount=disputed_amount
            )
            
            # Update contract/milestone status to disputed
            if milestone:
                milestone.status = 'disputed'
                milestone.save()
            else:
                contract.status = 'disputed'
                contract.save()
            
            return Response({
                'message': 'Dispute raised successfully',
                'dispute_id': str(dispute.dispute_id),
                'status': dispute.status
            }, status=status.HTTP_201_CREATED)
            
        except (Contract.DoesNotExist, ContractMilestone.DoesNotExist):
            return Response(
                {'error': 'Contract or milestone not found or not accessible'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to raise dispute: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ContractInstallmentListView(generics.ListCreateAPIView):
    serializer_class = ContractInstallmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        contract_id = self.kwargs.get('pk')
        return ContractInstallment.objects.filter(
            contract=contract_id
        ).filter(
            Q(contract__client=self.request.user) | Q(contract__professional=self.request.user)
        )
    
    @extend_schema(
        operation_id="create_contract_installment",
        summary="Create Contract Installment",
        description="Create a new installment for a contract",
        tags=["Installments"],
        request={
            'type': 'object',
            'properties': {
                'amount': {
                    'type': 'number',
                    'description': 'Installment amount'
                },
                'description': {
                    'type': 'string',
                    'description': 'Installment description'
                }
            },
            'required': ['amount']
        }
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(
                contract_id=pk,
                client=request.user
            )
            
            amount = Decimal(str(request.data.get('amount', 0)))
            description = request.data.get('description', '')
            
            if amount <= 0:
                return Response(
                    {'error': 'Amount must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if contract has sufficient balance
            if contract.contract_balance < amount:
                return Response(
                    {'error': 'Insufficient contract balance. Please allocate more funds to the contract first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create client wallet
            client_wallet, created = Wallet.objects.get_or_create(user=contract.client)
            
            # Check if client has sufficient pending balance (since contract balance comes from pending)
            if client_wallet.pending_balance < amount:
                return Response(
                    {'error': 'Insufficient pending balance in wallet.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate platform commission and net amount
            platform_commission = amount * contract.platform_commission_rate
            net_amount = amount - platform_commission
            
            # Create installment
            installment = ContractInstallment.objects.create(
                contract=contract,
                amount=amount,
                description=description,
                platform_commission_amount=platform_commission,
                net_amount_to_professional=net_amount
            )
            
            # Deduct from contract balance
            contract.contract_balance -= amount
            contract.save()
            
            # Deduct from client's pending balance (since contract balance comes from pending)
            client_wallet.pending_balance -= amount
            client_wallet.save()
            
            # Create wallet transaction record
            WalletTransaction.objects.create(
                wallet=client_wallet,
                amount=-amount,
                transaction_type='debit',
                source='installment_creation',
                description=f'Installment created for contract {contract.contract_number}'
            )
            
            serializer = ContractInstallmentSerializer(installment)
            return Response({
                'installment': serializer.data,
                'client_available_balance': float(client_wallet.available_balance),
                'client_pending_balance': float(client_wallet.pending_balance),
                'contract_balance': float(contract.contract_balance)
            }, status=status.HTTP_201_CREATED)
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found or not accessible'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to create installment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ContractInstallmentConfirmView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="confirm_contract_installment",
        summary="Confirm Contract Installment",
        description="Confirm an installment and transfer funds to professional balance",
        tags=["Installments"]
    )
    def post(self, request, pk, installment_id):
        try:
            installment = ContractInstallment.objects.filter(
                installment_id=installment_id,
                contract__contract_id=pk,
                status='pending'
            ).filter(
                Q(contract__client=request.user) | Q(contract__professional=request.user)
            ).get()
            
            # Confirm the installment
            installment.confirm_installment()
            
            serializer = ContractInstallmentSerializer(installment)
            return Response({
                'message': 'Installment confirmed successfully',
                'installment': serializer.data
            }, status=status.HTTP_200_OK)
            
        except ContractInstallment.DoesNotExist:
            return Response(
                {'error': 'Installment not found or not accessible'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to confirm installment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ContractInstallmentCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="cancel_contract_installment",
        summary="Cancel Contract Installment",
        description="Cancel a pending installment",
        tags=["Installments"]
    )
    def post(self, request, pk, installment_id):
        try:
            installment = ContractInstallment.objects.filter(
                installment_id=installment_id,
                contract__contract_id=pk,
                status='pending'
            ).filter(
                Q(contract__client=request.user) | Q(contract__professional=request.user)
            ).get()
            
            # Cancel the installment
            installment.cancel_installment()
            
            serializer = ContractInstallmentSerializer(installment)
            return Response({
                'message': 'Installment cancelled successfully',
                'installment': serializer.data
            }, status=status.HTTP_200_OK)
            
        except ContractInstallment.DoesNotExist:
            return Response(
                {'error': 'Installment not found or not accessible'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to cancel installment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ContractDisputeView(APIView):
    """Change contract status to disputed"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        operation_id="dispute_contract",
        summary="تحويل العقد إلى حالة نزاع",
        description="تحويل حالة العقد إلى disputed من قبل العميل",
        tags=["Contracts"]
    )
    def post(self, request, pk):
        try:
            contract = Contract.objects.get(pk=pk)
            
            # Check if user is the client of this contract
            if contract.client != request.user:
                return Response(
                    {'error': 'You are not authorized to dispute this contract'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if contract can be disputed
            if contract.status in ['completed', 'cancelled', 'terminated']:
                return Response(
                    {'error': 'Cannot dispute a contract that is already completed, cancelled, or terminated'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update contract status to disputed
            contract.status = 'disputed'
            contract.save()
            
            return Response(
                {
                    'message': 'Contract status changed to disputed successfully',
                    'contract_id': str(contract.id),
                    'status': contract.status
                },
                status=status.HTTP_200_OK
            )
            
        except Contract.DoesNotExist:
            return Response(
                {'error': 'Contract not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to dispute contract: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
