import requests
import json
import hashlib
import hmac
import time
from django.conf import settings
import logging
from decimal import Decimal
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class AuthorizeNetService:
    """
    خدمة التكامل مع Authorize.Net
    تتعامل مع معالجة المدفوعات والبطاقات الائتمانية
    """
    
    def __init__(self):
        self.api_login_id = settings.AUTHORIZE_NET_API_LOGIN_ID
        self.transaction_key = settings.AUTHORIZE_NET_TRANSACTION_KEY
        self.signature_key = settings.AUTHORIZE_NET_SIGNATURE_KEY
        self.public_client_key = settings.AUTHORIZE_NET_PUBLIC_CLIENT_KEY
        self.sandbox = settings.AUTHORIZE_NET_SANDBOX
        
        # Set API endpoint based on environment
        if self.sandbox:
            self.api_endpoint = "https://apitest.authorize.net/xml/v1/request.api"
        else:
            self.api_endpoint = "https://api.authorize.net/xml/v1/request.api"
    
    def _create_xml_request(self, transaction_type: str, **kwargs) -> str:
        """
        إنشاء طلب XML لـ Authorize.Net
        """
        xml_template = f"""
        <?xml version="1.0" encoding="utf-8"?>
        <createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
            <merchantAuthentication>
                <name>{self.api_login_id}</name>
                <transactionKey>{self.transaction_key}</transactionKey>
            </merchantAuthentication>
            <refId>{kwargs.get('ref_id', 'ref123456')}</refId>
            <transactionRequest>
                <transactionType>{transaction_type}</transactionType>
                <amount>{kwargs.get('amount', '0.00')}</amount>
                <payment>
                    <creditCard>
                        <cardNumber>{kwargs.get('card_number', '')}</cardNumber>
                        <expirationDate>{kwargs.get('expiry_date', '')}</expirationDate>
                        <cardCode>{kwargs.get('card_code', '')}</cardCode>
                    </creditCard>
                </payment>
                <order>
                    <invoiceNumber>{kwargs.get('invoice_number', '')}</invoiceNumber>
                    <description>{kwargs.get('description', '')}</description>
                </order>
                <customer>
                    <id>{kwargs.get('customer_id', '')}</id>
                    <email>{kwargs.get('customer_email', '')}</email>
                </customer>
                <billTo>
                    <firstName>{kwargs.get('first_name', '')}</firstName>
                    <lastName>{kwargs.get('last_name', '')}</lastName>
                </billTo>
            </transactionRequest>
        </createTransactionRequest>
        """
        return xml_template.strip()
    
    def _parse_xml_response(self, xml_response: str) -> Dict[str, Any]:
        """
        تحليل استجابة XML من Authorize.Net
        """
        try:
            import xml.etree.ElementTree as ET
            root = ET.fromstring(xml_response)
            
            # Extract namespace
            namespace = {'ns': 'AnetApi/xml/v1/schema/AnetApiSchema.xsd'}
            
            # Check result code
            result_code_elem = root.find('.//ns:resultCode', namespace)
            result_code = result_code_elem.text if result_code_elem is not None else 'Error'
            
            if result_code == 'Ok':
                # Extract transaction response
                trans_response = root.find('.//ns:transactionResponse', namespace)
                if trans_response is not None:
                    response_code_elem = trans_response.find('ns:responseCode', namespace)
                    trans_id_elem = trans_response.find('ns:transId', namespace)
                    auth_code_elem = trans_response.find('ns:authCode', namespace)
                    
                    response_code = response_code_elem.text if response_code_elem is not None else ''
                    trans_id = trans_id_elem.text if trans_id_elem is not None else ''
                    auth_code = auth_code_elem.text if auth_code_elem is not None else ''
                    
                    if response_code == '1':  # Approved
                        return {
                            'success': True,
                            'transaction_id': trans_id,
                            'auth_code': auth_code,
                            'response_code': response_code,
                            'message': 'Transaction approved'
                        }
                    else:
                        # Get error message
                        error_elem = trans_response.find('.//ns:errorText', namespace)
                        error_message = error_elem.text if error_elem is not None else 'Transaction declined'
                        
                        return {
                            'success': False,
                            'error': error_message,
                            'response_code': response_code
                        }
            else:
                # API error
                message_elem = root.find('.//ns:text', namespace)
                error_message = message_elem.text if message_elem is not None else 'API call failed'
                
                return {
                    'success': False,
                    'error': error_message
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to parse response: {str(e)}'
            }
    
    def charge_credit_card(
        self,
        amount: Decimal,
        card_number: str,
        expiry_date: str,  # Format: MMYY
        card_code: str,
        cardholder_name: str = "",
        description: str = "",
        invoice_number: str = "",
        customer_email: str = "",
        customer_id: str = ""
    ) -> Dict[str, Any]:
        """
        معالجة دفعة بالبطاقة الائتمانية
        
        Args:
            amount: المبلغ المراد خصمه
            card_number: رقم البطاقة
            expiry_date: تاريخ انتهاء البطاقة (MMYY)
            card_code: رمز الأمان (CVV)
            cardholder_name: اسم حامل البطاقة
            description: وصف المعاملة
            invoice_number: رقم الفاتورة
            customer_email: بريد العميل الإلكتروني
            customer_id: معرف العميل
        
        Returns:
            Dict containing transaction result
        """
        try:
            # Split cardholder name
            name_parts = cardholder_name.split(' ', 1) if cardholder_name else ['', '']
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create XML request
            xml_request = self._create_xml_request(
                transaction_type="authCaptureTransaction",
                amount=str(amount),
                card_number=card_number,
                expiry_date=expiry_date,
                card_code=card_code,
                first_name=first_name,
                last_name=last_name,
                description=description or "Payment transaction",
                invoice_number=invoice_number or "INV-" + str(int(amount * 100)),
                customer_email=customer_email,
                customer_id=customer_id,
                ref_id=f"ref_{invoice_number or str(int(time.time()))}"
            )
            
            # Send request
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                self.api_endpoint,
                data=xml_request,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return self._parse_xml_response(response.text)
            else:
                return {
                    'success': False,
                    'error': f'HTTP Error {response.status_code}: {response.text}'
                }
                
        except Exception as e:
            logger.error(f"Authorize.Net charge error: {str(e)}")
            return {
                'success': False,
                'error': f'Payment processing error: {str(e)}'
            }
    
    def refund_transaction(
        self,
        transaction_id: str,
        amount: Decimal = None
    ) -> Dict[str, Any]:
        """
        استرداد معاملة
        
        Args:
            transaction_id: معرف المعاملة المراد استردادها
            amount: المبلغ المراد استرداده (اختياري - إذا لم يتم تحديده سيتم استرداد المبلغ كاملاً)
            
        Returns:
            Dict يحتوي على نتيجة عملية الاسترداد
        """
        try:
            # Create XML request for refund
            xml_template = f"""
            <?xml version="1.0" encoding="utf-8"?>
            <createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
                <merchantAuthentication>
                    <name>{self.api_login_id}</name>
                    <transactionKey>{self.transaction_key}</transactionKey>
                </merchantAuthentication>
                <refId>refund_{transaction_id}</refId>
                <transactionRequest>
                    <transactionType>refundTransaction</transactionType>
                    <refTransId>{transaction_id}</refTransId>
                    {f'<amount>{amount}</amount>' if amount else ''}
                </transactionRequest>
            </createTransactionRequest>
            """
            
            # Send request
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                self.api_endpoint,
                data=xml_template.strip(),
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return self._parse_xml_response(response.text)
            else:
                return {
                    'success': False,
                    'error': f'HTTP Error {response.status_code}: {response.text}'
                }
                
        except Exception as e:
            logger.error(f"Authorize.Net refund error: {str(e)}")
            return {
                'success': False,
                'error': f'Refund processing error: {str(e)}'
            }
    
    def validate_card(
        self, 
        card_number: str, 
        expiry_month: str, 
        expiry_year: str, 
        card_code: str
    ) -> Dict[str, Any]:
        """
        التحقق من صحة البطاقة الائتمانية
        
        Args:
            card_number: رقم البطاقة
            expiry_month: شهر انتهاء الصلاحية
            expiry_year: سنة انتهاء الصلاحية
            card_code: رمز الأمان (CVV)
            
        Returns:
            Dict يحتوي على نتيجة التحقق
        """
        try:
            # Format expiry date (MMYY format)
            expiry_date = f"{expiry_month.zfill(2)}{expiry_year[-2:]}"
            
            # Create XML request for validation (auth only with minimal amount)
            xml_template = f"""
            <?xml version="1.0" encoding="utf-8"?>
            <createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
                <merchantAuthentication>
                    <name>{self.api_login_id}</name>
                    <transactionKey>{self.transaction_key}</transactionKey>
                </merchantAuthentication>
                <refId>validate_{int(time.time())}</refId>
                <transactionRequest>
                    <transactionType>authOnlyTransaction</transactionType>
                    <amount>0.01</amount>
                    <payment>
                        <creditCard>
                            <cardNumber>{card_number}</cardNumber>
                            <expirationDate>{expiry_date}</expirationDate>
                            <cardCode>{card_code}</cardCode>
                        </creditCard>
                    </payment>
                </transactionRequest>
            </createTransactionRequest>
            """
            
            # Send request
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                self.api_endpoint,
                data=xml_template.strip(),
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = self._parse_xml_response(response.text)
                
                if result['success']:
                    # Card is valid, now void the authorization
                    self._void_transaction(result['transaction_id'])
                    
                    return {
                        'success': True,
                        'message': 'Card validation successful',
                        'card_type': self._get_card_type(card_number)
                    }
                else:
                    return {
                        'success': False,
                        'error': 'Card validation failed - invalid card details'
                    }
            else:
                return {
                    'success': False,
                    'error': f'HTTP Error {response.status_code}: {response.text}'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Card validation failed: {str(e)}'
            }
    
    def _void_transaction(self, transaction_id: str) -> Dict[str, Any]:
        """
        إلغاء معاملة (للتحقق من البطاقة)
        """
        try:
            xml_template = f"""
            <?xml version="1.0" encoding="utf-8"?>
            <createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
                <merchantAuthentication>
                    <name>{self.api_login_id}</name>
                    <transactionKey>{self.transaction_key}</transactionKey>
                </merchantAuthentication>
                <refId>void_{transaction_id}</refId>
                <transactionRequest>
                    <transactionType>voidTransaction</transactionType>
                    <refTransId>{transaction_id}</refTransId>
                </transactionRequest>
            </createTransactionRequest>
            """
            
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                self.api_endpoint,
                data=xml_template.strip(),
                headers=headers,
                timeout=30
            )
            
            return self._parse_xml_response(response.text) if response.status_code == 200 else {'success': False}
            
        except Exception:
            return {'success': False}
    
    def _get_card_type(self, card_number: str) -> str:
        """
        تحديد نوع البطاقة من رقمها
        """
        card_number = card_number.replace(' ', '').replace('-', '')
        
        if card_number.startswith('4'):
            return 'Visa'
        elif card_number.startswith(('51', '52', '53', '54', '55')) or card_number.startswith(tuple(str(i) for i in range(2221, 2721))):
            return 'MasterCard'
        elif card_number.startswith(('34', '37')):
            return 'American Express'
        elif card_number.startswith('6011') or card_number.startswith(tuple(str(i) for i in range(644, 650))) or card_number.startswith('65'):
            return 'Discover'
        else:
            return 'Unknown'
    
    def get_transaction_details(self, transaction_id: str) -> Dict[str, Any]:
        """
        الحصول على تفاصيل معاملة
        
        Args:
            transaction_id: معرف المعاملة
            
        Returns:
            Dict يحتوي على تفاصيل المعاملة
        """
        try:
            xml_template = f"""
            <?xml version="1.0" encoding="utf-8"?>
            <getTransactionDetailsRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
                <merchantAuthentication>
                    <name>{self.api_login_id}</name>
                    <transactionKey>{self.transaction_key}</transactionKey>
                </merchantAuthentication>
                <transId>{transaction_id}</transId>
            </getTransactionDetailsRequest>
            """
            
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                self.api_endpoint,
                data=xml_template.strip(),
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                # Parse transaction details response
                try:
                    import xml.etree.ElementTree as ET
                    root = ET.fromstring(response.text)
                    namespace = {'ns': 'AnetApi/xml/v1/schema/AnetApiSchema.xsd'}
                    
                    result_code_elem = root.find('.//ns:resultCode', namespace)
                    if result_code_elem is not None and result_code_elem.text == 'Ok':
                        transaction_elem = root.find('.//ns:transaction', namespace)
                        if transaction_elem is not None:
                            trans_id = transaction_elem.find('ns:transId', namespace)
                            amount = transaction_elem.find('ns:authAmount', namespace)
                            status = transaction_elem.find('ns:transactionStatus', namespace)
                            
                            return {
                                'success': True,
                                'transaction_id': trans_id.text if trans_id is not None else '',
                                'amount': amount.text if amount is not None else '0.00',
                                'status': status.text if status is not None else 'unknown'
                            }
                    
                    return {
                        'success': False,
                        'error': 'Transaction not found or API error'
                    }
                    
                except Exception as parse_error:
                    return {
                        'success': False,
                        'error': f'Failed to parse response: {str(parse_error)}'
                    }
            else:
                return {
                    'success': False,
                    'error': f'HTTP Error {response.status_code}: {response.text}'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to get transaction details: {str(e)}'
            }


# إنشاء instance واحد للاستخدام في التطبيق
authorize_net_service = AuthorizeNetService()