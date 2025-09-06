import os
import logging
from typing import Optional, Dict, Any
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, CustomArg, MailSettings, SandBoxMode, Header, TrackingSettings, ClickTracking, OpenTracking, SubscriptionTracking, SpamCheck
from .models import EmailDeliveryLog
from .email_deliverability_config import EmailDeliverabilityConfig, SENDGRID_ENHANCED_CONFIG

logger = logging.getLogger(__name__)

class SendGridEmailService:
    """
    خدمة إرسال البريد الإلكتروني باستخدام SendGrid مع تتبع الحالة
    """
    
    def __init__(self):
        self.api_key = settings.SENDGRID_API_KEY
        self.from_email = settings.SENDGRID_FROM_EMAIL
        self.client = None
        # تفعيل وضع Sandbox للاختبار (يمكن تعطيله في الإنتاج)
        self.sandbox_mode = settings.SENDGRID_SANDBOX_MODE
        
        if self.api_key:
            self.client = SendGridAPIClient(api_key=self.api_key)
        else:
            logger.error("SendGrid API key not found in settings")
    
    def send_verification_email(self, user, verification_token) -> Optional[EmailDeliveryLog]:
        """
        إرسال بريد التحقق من البريد الإلكتروني
        """
        print(f"DEBUG: Starting send_verification_email for user: {user.email if hasattr(user, 'email') else 'Unknown'}")
        print(f"DEBUG: verification_token type: {type(verification_token)}, value: {verification_token}")
        
        if not self.client:
            logger.error("SendGrid client not initialized")
            return None
        
        # إنشاء سجل تتبع البريد الإلكتروني
        email_log = EmailDeliveryLog.objects.create(
            user=user,
            email_type='verification',
            recipient_email=user.email,
            subject='Welcome to A-List Home Professionals - Email Verification',
            status='pending',
            provider='sendgrid'
        )
        
        try:
            # تحديد رابط Frontend حسب البيئة
            frontend_url = self._get_frontend_url()
            
            # التعامل مع verification_token سواء كان كائن أو string
            if hasattr(verification_token, 'token'):
                token_value = verification_token.token
            elif isinstance(verification_token, str):
                token_value = verification_token
            else:
                logger.error(f"Invalid verification_token type: {type(verification_token)}")
                token_value = str(verification_token)
            
            print(f"DEBUG: token_value extracted: {token_value}")
            
            # إنشاء رابط التحقق (Frontend فقط)
            verification_url = f"{frontend_url}/verify-email?token={token_value}"
            
            # إعداد محتوى البريد الإلكتروني
            context = {
                'user': user,
                'verification_url': verification_url,
                'site_name': EmailDeliverabilityConfig.SITE_NAME,
                'brand_name': EmailDeliverabilityConfig.BRAND_NAME,
                'company_name': EmailDeliverabilityConfig.COMPANY_NAME,
                'frontend_url': frontend_url,
                'welcome_url': self._get_success_redirect_url(),
            }
            
            # إنشاء محتوى HTML
            try:
                html_content = self._render_email_template('verification_email.html', context)
            except Exception as e:
                logger.error(f"Failed to render HTML template: {e}")
                logger.error(f"Context type: {type(context)}, Context value: {context}")
                html_content = self._get_default_verification_content(context)
            
            # إنشاء محتوى نصي
            try:
                text_content = self._render_email_template('verification_email.txt', context)
            except Exception as e:
                logger.error(f"Failed to render text template: {e}")
                text_content = strip_tags(html_content) if html_content else self._get_default_verification_content(context)
            
            # إعداد البريد الإلكتروني مع التحسينات
            try:
                print(f"DEBUG: About to create Mail object")
                print(f"DEBUG: user type: {type(user)}, user email: {getattr(user, 'email', 'NO EMAIL')}")
                print(f"DEBUG: html_content type: {type(html_content)}, length: {len(html_content) if html_content else 0}")
                print(f"DEBUG: text_content type: {type(text_content)}, length: {len(text_content) if text_content else 0}")
                
                # التأكد من أن user هو كائن صحيح
                if not hasattr(user, 'email'):
                    raise ValueError(f"Invalid user object: {type(user)}")
                
                # الحصول على اسم المستخدم بشكل آمن
                user_name = ''
                if hasattr(user, 'get_full_name') and callable(user.get_full_name):
                    user_name = user.get_full_name() or ''
                if not user_name and hasattr(user, 'username'):
                    user_name = user.username
                
                print(f"DEBUG: About to create Mail with user_name: {user_name}")
                
                message = Mail(
                    from_email=Email(self.from_email, EmailDeliverabilityConfig.SENDER_NAME),
                    to_emails=To(user.email, user_name),
                    subject=email_log.subject,
                    html_content=Content("text/html", html_content),
                    plain_text_content=Content("text/plain", text_content)
                )
                
                print(f"DEBUG: Mail object created successfully")
            except Exception as e:
                logger.error(f"Error creating Mail object: {e}")
                logger.error(f"user type: {type(user)}, user value: {user}")
                logger.error(f"html_content type: {type(html_content)}")
                logger.error(f"text_content type: {type(text_content)}")
                raise
            
            # إضافة رؤوس محسنة لتحسين السمعة
            message.reply_to = Email(EmailDeliverabilityConfig.REPLY_TO_EMAIL, EmailDeliverabilityConfig.SENDER_NAME)
            
            # إضافة رؤوس مخصصة محسنة
            unsubscribe_url = EmailDeliverabilityConfig.get_unsubscribe_url(user.email)
            message.add_header(Header('List-Unsubscribe', f'<{unsubscribe_url}>'))
            message.add_header(Header('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click'))
            
            # إضافة جميع الرؤوس المحسنة
            for header_name, header_value in EmailDeliverabilityConfig.EMAIL_HEADERS.items():
                message.add_header(Header(header_name, header_value))
            
            # إضافة إعدادات التتبع المحسنة
            # التأكد من أن SENDGRID_ENHANCED_CONFIG هو قاموس
            import json
            config = SENDGRID_ENHANCED_CONFIG
            print(f"DEBUG: config type: {type(config)}, value: {config}")
            if isinstance(config, str):
                try:
                    config = json.loads(config)
                    print(f"DEBUG: config after JSON parse: {config}")
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse SENDGRID_ENHANCED_CONFIG as JSON: {e}")
                    config = {}
            
            tracking_settings = TrackingSettings()
            print(f"DEBUG: About to check tracking_settings in config")
            if config and 'tracking_settings' in config:
                print(f"DEBUG: Found tracking_settings in config")
                try:
                    tracking_settings.click_tracking = ClickTracking(
                        enable=config['tracking_settings']['click_tracking']['enable'],
                        enable_text=config['tracking_settings']['click_tracking']['enable_text']
                    )
                    print(f"DEBUG: click_tracking set successfully")
                    tracking_settings.open_tracking = OpenTracking(
                        enable=config['tracking_settings']['open_tracking']['enable']
                    )
                    print(f"DEBUG: open_tracking set successfully")
                    tracking_settings.subscription_tracking = SubscriptionTracking(
                        enable=config['tracking_settings']['subscription_tracking']['enable']
                    )
                    print(f"DEBUG: subscription_tracking set successfully")
                except Exception as e:
                    print(f"DEBUG: Error in tracking settings: {e}")
                    logger.error(f"Error setting tracking settings: {e}")
            print(f"DEBUG: About to set tracking_settings on message")
            message.tracking_settings = tracking_settings
            print(f"DEBUG: tracking_settings set on message successfully")
            
            # إضافة إعدادات البريد المحسنة
            mail_settings = MailSettings()
            
            # إضافة وضع Sandbox للاختبار
            if self.sandbox_mode:
                mail_settings.sandbox_mode = SandBoxMode(enable=True)
                logger.info(f"SendGrid Sandbox mode enabled for testing - email to {user.email}")
            
            message.mail_settings = mail_settings
            
            # Footer معطل في الإعدادات الحالية
            
            # إضافة Footer مباشرة إلى المحتوى
            footer_html = ''
            footer_text = ''
            if config and 'mail_settings' in config and 'footer' in config['mail_settings']:
                footer_html = config['mail_settings']['footer'].get('html', '')
                footer_text = config['mail_settings']['footer'].get('text', '')
            
            # تحديث المحتوى ليتضمن Footer
            if html_content and footer_html:
                enhanced_html_content = html_content + footer_html
                # إزالة المحتوى القديم وإضافة المحتوى الجديد
                message.content = []
                message.add_content(Content("text/html", enhanced_html_content))
            
            if text_content and footer_text:
                enhanced_text_content = text_content + footer_text
                message.add_content(Content("text/plain", enhanced_text_content))
            
            # إضافة معرف مخصص للتتبع
            message.add_custom_arg(CustomArg('email_log_id', str(email_log.id)))
            message.add_custom_arg(CustomArg('user_id', str(user.id)))
            message.add_custom_arg(CustomArg('email_type', 'verification'))
            
            # إرسال البريد الإلكتروني
            print(f"DEBUG: About to send email via SendGrid")
            try:
                response = self.client.send(message)
                print(f"DEBUG: SendGrid response status: {response.status_code}")
            except Exception as e:
                print(f"ERROR: Error during SendGrid send: {e}")
                # Try to get more details from the error
                if hasattr(e, 'body'):
                    print(f"DEBUG: SendGrid error body: {e.body}")
                if hasattr(e, 'headers'):
                    print(f"DEBUG: SendGrid error headers: {e.headers}")
                raise e
            
            if response.status_code in [200, 202]:
                # تحديث حالة البريد الإلكتروني إلى مرسل
                print(f"DEBUG: About to get message_id from headers")
                try:
                    message_id = response.headers.get('X-Message-Id', '')
                    print(f"DEBUG: message_id extracted: {message_id}")
                except Exception as e:
                    print(f"DEBUG: Error getting message_id: {e}")
                    message_id = ''
                email_log.mark_as_sent(provider_message_id=message_id)
                logger.info(f"Verification email sent successfully to {user.email}")
                return email_log
            else:
                # فشل في الإرسال
                error_msg = f"SendGrid returned status code: {response.status_code}"
                email_log.mark_as_failed(error_msg)
                logger.error(f"Failed to send verification email to {user.email}: {error_msg}")
                return email_log
                
        except Exception as e:
            # خطأ في الإرسال
            error_msg = str(e)
            email_log.mark_as_failed(error_msg)
            logger.error(f"Exception while sending verification email to {user.email}: {error_msg}")
            return email_log
    
    def send_password_reset_email(self, user, reset_token) -> Optional[EmailDeliveryLog]:
        """
        إرسال بريد إعادة تعيين كلمة المرور
        """
        if not self.client:
            logger.error("SendGrid client not initialized")
            return None
        
        # إنشاء سجل تتبع البريد الإلكتروني
        email_log = EmailDeliveryLog.objects.create(
            user=user,
            email_type='password_reset',
            recipient_email=user.email,
            subject='إعادة تعيين كلمة المرور - منصة هومز',
            status='pending',
            provider='sendgrid'
        )
        
        try:
            # إنشاء رابط إعادة التعيين
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
            
            # إعداد محتوى البريد الإلكتروني
            context = {
                'user': user,
                'reset_url': reset_url,
                'site_name': 'منصة هومز',
            }
            
            # إنشاء محتوى HTML
            html_content = self._render_email_template('password_reset_email.html', context)
            
            # إنشاء محتوى نصي
            text_content = self._render_email_template('password_reset_email.txt', context)
            
            # إعداد البريد الإلكتروني
            message = Mail(
                from_email=Email(self.from_email, 'منصة هومز'),
                to_emails=To(user.email, user.get_full_name() or user.username),
                subject=email_log.subject,
                html_content=Content("text/html", html_content),
                plain_text_content=Content("text/plain", text_content)
            )
            
            # إضافة رؤوس محسنة لتحسين السمعة
            message.reply_to = Email(self.from_email, 'منصة هومز')
            
            # إضافة رؤوس مخصصة
            unsubscribe_url = f"{settings.FRONTEND_URL}/unsubscribe?email={user.email}"
            message.add_header(Header('List-Unsubscribe', f'<{unsubscribe_url}>'))
            message.add_header(Header('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click'))
            message.add_header(Header('X-Entity-ID', 'homs-platform'))
            message.add_header(Header('X-Auto-Response-Suppress', 'OOF, DR, RN, NRN, AutoReply'))
            
            # إضافة وضع Sandbox للاختبار
            if self.sandbox_mode:
                mail_settings = MailSettings()
                mail_settings.sandbox_mode = SandBoxMode(enable=True)
                message.mail_settings = mail_settings
                logger.info(f"SendGrid Sandbox mode enabled for testing - password reset email to {user.email}")
            
            # إضافة معرف مخصص للتتبع
            message.add_custom_arg(CustomArg('email_log_id', str(email_log.id)))
            message.add_custom_arg(CustomArg('user_id', str(user.id)))
            message.add_custom_arg(CustomArg('email_type', 'password_reset'))
            
            # إرسال البريد الإلكتروني
            response = self.client.send(message)
            
            if response.status_code in [200, 202]:
                # تحديث حالة البريد الإلكتروني إلى مرسل
                message_id = response.headers.get('X-Message-Id', '')
                email_log.mark_as_sent(provider_message_id=message_id)
                logger.info(f"Password reset email sent successfully to {user.email}")
                return email_log
            else:
                # فشل في الإرسال
                error_msg = f"SendGrid returned status code: {response.status_code}"
                email_log.mark_as_failed(error_msg)
                logger.error(f"Failed to send password reset email to {user.email}: {error_msg}")
                return email_log
                
        except Exception as e:
            # خطأ في الإرسال
            error_msg = str(e)
            email_log.mark_as_failed(error_msg)
            logger.error(f"Exception while sending password reset email to {user.email}: {error_msg}")
            return email_log
    
    def send_welcome_email(self, user) -> Optional[EmailDeliveryLog]:
        """
        إرسال بريد الترحيب للمستخدمين الجدد
        """
        if not self.client:
            logger.error("SendGrid client not initialized")
            return None
        
        # إنشاء سجل تتبع البريد الإلكتروني
        email_log = EmailDeliveryLog.objects.create(
            user=user,
            email_type='welcome',
            recipient_email=user.email,
            subject='مرحباً بك في منصة هومز',
            status='pending',
            provider='sendgrid'
        )
        
        try:
            # إعداد محتوى البريد الإلكتروني
            context = {
                'user': user,
                'site_name': 'منصة هومز',
                'dashboard_url': f"{settings.FRONTEND_URL}/dashboard",
            }
            
            # إنشاء محتوى HTML
            html_content = self._render_email_template('welcome_email.html', context)
            
            # إنشاء محتوى نصي
            text_content = self._render_email_template('welcome_email.txt', context)
            
            # إعداد البريد الإلكتروني
            message = Mail(
                from_email=Email(self.from_email, 'منصة هومز'),
                to_emails=To(user.email, user.get_full_name() or user.username),
                subject=email_log.subject,
                html_content=Content("text/html", html_content),
                plain_text_content=Content("text/plain", text_content)
            )
            
            # إضافة رؤوس محسنة لتحسين السمعة
            message.reply_to = Email(self.from_email, 'منصة هومز')
            
            # إضافة رؤوس مخصصة
            unsubscribe_url = f"{settings.FRONTEND_URL}/unsubscribe?email={user.email}"
            message.add_header(Header('List-Unsubscribe', f'<{unsubscribe_url}>'))
            message.add_header(Header('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click'))
            message.add_header(Header('X-Entity-ID', 'homs-platform'))
            message.add_header(Header('X-Auto-Response-Suppress', 'OOF, DR, RN, NRN, AutoReply'))
            
            # إضافة وضع Sandbox للاختبار
            if self.sandbox_mode:
                mail_settings = MailSettings()
                mail_settings.sandbox_mode = SandBoxMode(enable=True)
                message.mail_settings = mail_settings
                logger.info(f"SendGrid Sandbox mode enabled for testing - welcome email to {user.email}")
            
            # إضافة معرف مخصص للتتبع
            message.add_custom_arg(CustomArg('email_log_id', str(email_log.id)))
            message.add_custom_arg(CustomArg('user_id', str(user.id)))
            message.add_custom_arg(CustomArg('email_type', 'welcome'))
            
            # إرسال البريد الإلكتروني
            response = self.client.send(message)
            
            if response.status_code in [200, 202]:
                # تحديث حالة البريد الإلكتروني إلى مرسل
                message_id = response.headers.get('X-Message-Id', '')
                email_log.mark_as_sent(provider_message_id=message_id)
                logger.info(f"Welcome email sent successfully to {user.email}")
                return email_log
            else:
                # فشل في الإرسال
                error_msg = f"SendGrid returned status code: {response.status_code}"
                email_log.mark_as_failed(error_msg)
                logger.error(f"Failed to send welcome email to {user.email}: {error_msg}")
                return email_log
                
        except Exception as e:
            # خطأ في الإرسال
            error_msg = str(e)
            email_log.mark_as_failed(error_msg)
            logger.error(f"Exception while sending welcome email to {user.email}: {error_msg}")
            return email_log
    
    def _render_email_template(self, template_name: str, context: Dict[str, Any]) -> str:
        """
        تحويل قالب البريد الإلكتروني إلى نص
        """
        print(f"DEBUG: _render_email_template called with template: {template_name}")
        print(f"DEBUG: context type in _render_email_template: {type(context)}")
        print(f"DEBUG: context value in _render_email_template: {context}")
        try:
            return render_to_string(f'emails/{template_name}', context)
        except Exception as e:
            logger.error(f"Failed to render email template {template_name}: {str(e)}")
            # إرجاع محتوى افتراضي في حالة فشل القالب
            if 'verification' in template_name:
                return self._get_default_verification_content(context)
            elif 'password_reset' in template_name:
                return self._get_default_password_reset_content(context)
            elif 'welcome' in template_name:
                return self._get_default_welcome_content(context)
            else:
                return "محتوى البريد الإلكتروني"
    
    def _get_default_verification_content(self, context: Dict[str, Any]) -> str:
        """
        محتوى افتراضي لبريد التحقق
        """
        print(f"DEBUG: _get_default_verification_content called with context type: {type(context)}")
        print(f"DEBUG: Context content: {context}")
        
        # التحقق من أن context هو dictionary
        if not isinstance(context, dict):
            logger.error(f"ERROR: context is not a dictionary, it's {type(context)}")
            return "Error processing email content"
            
        user = context.get('user')
        username = user.username if user else 'User'
        verification_url = context.get('verification_url', '#')
        site_name = context.get('site_name', 'A-List Home Professionals')
        
        return f"""
        <html>
        <body>
            <h2>Welcome to {site_name}!</h2>
            <p>Hello {username},</p>
            <p>Please click the link below to verify your email address:</p>
            <p><a href="{verification_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>{verification_url}</p>
            <p>Thank you,<br>{site_name} Team</p>
        </body>
        </html>
        """
    
    def _get_default_password_reset_content(self, context: Dict[str, Any]) -> str:
        """
        محتوى افتراضي لبريد إعادة تعيين كلمة المرور
        """
        if 'reset_url' in context:
            user = context.get('user')
            username = user.username if user else ''
            return f"""
            مرحباً {username},
            
            يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:
            {context['reset_url']}
            
            شكراً لك،
            فريق منصة هومز
            """
        else:
            return "إعادة تعيين كلمة المرور"
    
    def _get_default_welcome_content(self, context: Dict[str, Any]) -> str:
        """
        محتوى افتراضي لبريد الترحيب
        """
        user = context.get('user')
        username = user.username if user else ''
        return f"""
        مرحباً {username},
        
        مرحباً بك في منصة هومز! نحن سعداء لانضمامك إلينا.
        
        يمكنك الآن البدء في استخدام المنصة والاستفادة من جميع الخدمات المتاحة.
        
        شكراً لك،
        فريق منصة هومز
        """
    
    def _get_frontend_url(self) -> str:
        """
        تحديد رابط Frontend حسب البيئة
        """
        # في بيئة التطوير، استخدم localhost
        if settings.DEBUG:
            return "http://localhost:3000"
        
        # في بيئة الإنتاج، استخدم الرابط المنشور
        return EmailDeliverabilityConfig.FRONTEND_URL
        
    def _get_success_redirect_url(self) -> str:
        """
        تحديد رابط صفحة النجاح بعد التحقق
        """
        frontend_url = self._get_frontend_url()
        return f"{frontend_url}/welcome"

# إنشاء مثيل واحد من الخدمة
sendgrid_service = SendGridEmailService()