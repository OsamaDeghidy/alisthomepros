from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Sum, Count, Q
from django.utils.safestring import mark_safe
from .models import (
    Currency, Wallet, WalletTransaction, EscrowAccount, 
    PaymentMethod, Payment, Withdrawal, BankAccount
)


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    """
    إدارة العملات
    """
    list_display = (
        'code', 'name', 'symbol', 'exchange_rate', 
        'is_active', 'created_at'
    )
    list_filter = ('is_active', 'created_at')
    search_fields = ('code', 'name')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('exchange_rate', 'is_active')
    ordering = ('name',)
    
    fieldsets = (
        ('Currency Information', {
            'fields': ('code', 'name', 'symbol')
        }),
        ('Exchange Rate', {
            'fields': ('exchange_rate',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """
    إدارة المحافظ الرقمية
    """
    list_display = (
        'user', 'available_balance_formatted', 'pending_balance_formatted',
        'total_earned_formatted', 'currency', 'is_active', 'created_at'
    )
    list_filter = ('currency', 'is_active', 'created_at')
    search_fields = (
        'user__username', 'user__email', 'user__first_name', 'user__last_name'
    )
    readonly_fields = (
        'total_balance', 'transactions_count', 'created_at', 'updated_at'
    )
    autocomplete_fields = ['user', 'currency']
    ordering = ('-total_earned',)
    
    fieldsets = (
        ('Wallet Owner', {
            'fields': ('user',)
        }),
        ('Balances', {
            'fields': (
                'available_balance', 'pending_balance', 'total_earned',
                'total_balance'
            )
        }),
        ('Settings', {
            'fields': ('currency', 'is_active')
        }),
        ('Statistics', {
            'fields': ('transactions_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def available_balance_formatted(self, obj):
        return "${:,.2f}".format(float(obj.available_balance))
    available_balance_formatted.short_description = 'الرصيد المتاح'
    
    def pending_balance_formatted(self, obj):
        return "${:,.2f}".format(float(obj.pending_balance))
    pending_balance_formatted.short_description = 'الرصيد المعلق'
    
    def total_earned_formatted(self, obj):
        return "${:,.2f}".format(float(obj.total_earned))
    total_earned_formatted.short_description = 'إجمالي الأرباح'
    
    def transactions_count(self, obj):
        count = obj.transactions.count()
        url = reverse('admin:payments_wallettransaction_changelist') + '?wallet__id__exact={}'.format(obj.id)
        return format_html('<a href="{}">{} معاملة</a>', url, count)
    transactions_count.short_description = 'عدد المعاملات'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'currency')


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    """
    إدارة معاملات المحافظ
    """
    list_display = (
        'wallet_user', 'amount_formatted', 'transaction_type',
        'source', 'payment_link', 'created_at'
    )
    list_filter = (
        'transaction_type', 'source', 'created_at'
    )
    search_fields = (
        'wallet__user__username', 'wallet__user__email',
        'description', 'source'
    )
    readonly_fields = ('created_at',)
    autocomplete_fields = ['wallet', 'payment', 'escrow']
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('wallet', 'amount', 'transaction_type')
        }),
        ('Source & Description', {
            'fields': ('source', 'description')
        }),
        ('References', {
            'fields': ('payment', 'escrow'),
            'classes': ('collapse',)
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
    
    def wallet_user(self, obj):
        return obj.wallet.user.get_full_name()
    wallet_user.short_description = 'صاحب المحفظة'
    
    def amount_formatted(self, obj):
        color = 'green' if obj.transaction_type == 'credit' else 'red'
        sign = '+' if obj.transaction_type == 'credit' else '-'
        amount_str = "${:,.2f}".format(float(obj.amount))
        return format_html(
            '<span style="color: {};">{} {}</span>',
            color, sign, amount_str
        )
    amount_formatted.short_description = 'المبلغ'
    
    def payment_link(self, obj):
        if obj.payment:
            url = reverse('admin:payments_payment_change', args=[obj.payment.id])
            return format_html('<a href="{}">عرض الدفعة</a>', url)
        return '-'
    payment_link.short_description = 'الدفعة المرتبطة'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'wallet__user', 'payment', 'escrow'
        )


@admin.register(EscrowAccount)
class EscrowAccountAdmin(admin.ModelAdmin):
    """
    إدارة حسابات الضمان
    """
    list_display = (
        'escrow_id', 'client', 'professional', 'amount_formatted',
        'status', 'funded_at', 'auto_release_date'
    )
    list_filter = (
        'status', 'funded_at', 'released_at', 'auto_release_date'
    )
    search_fields = (
        'escrow_id', 'client__username', 'professional__username',
        'contract__title', 'description'
    )
    readonly_fields = (
        'escrow_id', 'platform_fee_amount', 'processing_fee_amount',
        'net_amount', 'created_at', 'updated_at'
    )
    autocomplete_fields = ['client', 'professional', 'contract', 'milestone']
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Escrow Information', {
            'fields': ('escrow_id', 'client', 'professional')
        }),
        ('Project Details', {
            'fields': ('contract', 'milestone', 'description')
        }),
        ('Financial Details', {
            'fields': (
                'amount', 'currency', 'platform_fee_rate', 'platform_fee_amount',
                'processing_fee_rate', 'processing_fee_fixed', 'processing_fee_amount',
                'net_amount'
            )
        }),
        ('Status & Dates', {
            'fields': (
                'status', 'funded_at', 'release_date', 'auto_release_date',
                'released_at', 'terms_accepted', 'auto_release_days'
            )
        }),
        ('Dispute Information', {
            'fields': (
                'dispute_reason', 'dispute_raised_by', 'dispute_raised_at'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def amount_formatted(self, obj):
        return "${:,.2f}".format(float(obj.amount))
    amount_formatted.short_description = 'المبلغ'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'client', 'professional', 'contract', 'milestone', 'currency'
        )


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """
    إدارة طرق الدفع
    """
    list_display = (
        'user', 'type', 'provider', 'last4_display',
        'is_default', 'is_verified', 'created_at'
    )
    list_filter = ('type', 'provider', 'is_default', 'is_verified', 'created_at')
    search_fields = (
        'user__username', 'user__email', 'provider', 'cardholder_name'
    )
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['user']
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Payment Method Owner', {
            'fields': ('user',)
        }),
        ('Method Details', {
            'fields': ('type', 'provider', 'last4', 'expiry_date', 'cardholder_name')
        }),
        ('Settings', {
            'fields': ('is_default', 'is_verified')
        }),
        ('External Integration', {
            'fields': ('stripe_payment_method_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def last4_display(self, obj):
        if obj.last4:
            return "****{}".format(obj.last4)
        return '-'
    last4_display.short_description = 'آخر 4 أرقام'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    إدارة المدفوعات
    """
    list_display = (
        'payment_id', 'payer', 'payee', 'amount_formatted',
        'payment_type', 'status', 'created_at'
    )
    list_filter = (
        'status', 'payment_type', 'currency', 'created_at', 'processed_at'
    )
    search_fields = (
        'payment_id', 'payer__username', 'payee__username',
        'description', 'stripe_payment_intent_id'
    )
    readonly_fields = (
        'payment_id', 'net_amount', 'created_at', 'updated_at', 'processed_at'
    )
    autocomplete_fields = [
        'payer', 'payee', 'currency', 'contract', 'milestone', 
        'escrow', 'payment_method'
    ]
    list_editable = ('status',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('payment_id', 'payer', 'payee', 'payment_type')
        }),
        ('Financial Details', {
            'fields': (
                'amount', 'currency', 'gross_amount', 'platform_fee',
                'processing_fee', 'net_amount'
            )
        }),
        ('References', {
            'fields': ('contract', 'milestone', 'escrow', 'payment_method')
        }),
        ('Status & Processing', {
            'fields': ('status', 'processed_at')
        }),
        ('External Integration', {
            'fields': ('stripe_payment_intent_id',),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('description', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_succeeded', 'mark_as_failed', 'export_payments']
    
    def amount_formatted(self, obj):
        return "${:,.2f}".format(float(obj.amount))
    amount_formatted.short_description = 'المبلغ'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'payer', 'payee', 'currency', 'contract', 'payment_method'
        )
    
    def mark_as_succeeded(self, request, queryset):
        updated = queryset.update(status='succeeded')
        self.message_user(request, '{} دفعة تم تأكيد نجاحها.'.format(updated))
    mark_as_succeeded.short_description = 'تأكيد نجاح الدفع'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, '{} دفعة تم تحديدها كفاشلة.'.format(updated))
    mark_as_failed.short_description = 'تحديد كدفع فاشل'


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    """
    إدارة الحسابات المصرفية
    """
    list_display = (
        'user', 'full_legal_name', 'bank_name', 'masked_account_number',
        'account_type', 'status', 'kyc_verified', 'created_at'
    )
    list_filter = ('account_type', 'status', 'kyc_verified', 'created_at')
    search_fields = (
        'user__username', 'user__email', 'full_legal_name',
        'bank_name', 'routing_number'
    )
    readonly_fields = ('created_at', 'updated_at', 'kyc_verified_at')
    autocomplete_fields = ['user']
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Account Owner', {
            'fields': ('user', 'full_legal_name')
        }),
        ('Bank Information', {
            'fields': ('bank_name', 'account_number', 'routing_number', 'account_type')
        }),
        ('Business Information', {
            'fields': ('business_name', 'business_ein'),
            'classes': ('collapse',)
        }),
        ('Personal Information', {
            'fields': ('ssn_last4', 'date_of_birth'),
            'classes': ('collapse',)
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code'),
            'classes': ('collapse',)
        }),
        ('Contact Information', {
            'fields': ('phone_number',),
            'classes': ('collapse',)
        }),
        ('Verification Status', {
            'fields': ('status', 'kyc_verified', 'kyc_verified_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def masked_account_number(self, obj):
        if obj.account_number:
            return "****{}".format(obj.account_number[-4:])
        return "-"
    masked_account_number.short_description = 'رقم الحساب'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    """
    إدارة طلبات السحب
    """
    list_display = (
        'user', 'amount_formatted', 'status', 'bank_account_info',
        'requested_at', 'processed_at'
    )
    list_filter = ('status', 'currency', 'requested_at', 'processed_at')
    search_fields = (
        'user__username', 'user__email', 'ach_trace_number', 'notes'
    )
    readonly_fields = ('requested_at', 'processed_at', 'completed_at', 'net_amount')
    autocomplete_fields = ['user', 'wallet', 'bank_account', 'currency']
    ordering = ('-requested_at',)
    
    fieldsets = (
        ('Withdrawal Information', {
            'fields': ('user', 'wallet', 'amount', 'currency')
        }),
        ('Bank Account', {
            'fields': ('bank_account',)
        }),
        ('Financial Details', {
            'fields': ('processing_fee', 'net_amount')
        }),
        ('Status & Processing', {
            'fields': ('status', 'ach_trace_number', 'estimated_arrival', 'failure_reason')
        }),
        ('Notes', {
            'fields': ('notes', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('requested_at', 'processed_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def amount_formatted(self, obj):
        return "${:,.2f}".format(float(obj.amount))
    amount_formatted.short_description = 'مبلغ السحب'
    
    def bank_account_info(self, obj):
        if obj.bank_account:
            return "{} - ****{}".format(obj.bank_account.bank_name, obj.bank_account.account_number[-4:])
        return "-"
    bank_account_info.short_description = 'الحساب المصرفي'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'wallet', 'bank_account', 'currency'
        )


# تخصيص موقع الإدارة
admin.site.site_header = 'A-List Payments Admin'
admin.site.site_title = 'Payments Management'
admin.site.index_title = 'إدارة المدفوعات'
