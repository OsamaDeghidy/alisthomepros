# إعدادات تحسين قابلية تسليم البريد الإلكتروني
# Email Deliverability Configuration

from django.conf import settings

class EmailDeliverabilityConfig:
    """
    إعدادات تحسين قابلية تسليم البريد الإلكتروني لتجنب مجلد الرسائل غير المرغوب فيها
    Email deliverability configuration to avoid spam folder
    """
    
    # إعدادات المرسل - Sender Settings
    SENDER_NAME = "A-List Home Professionals"
    SENDER_EMAIL = settings.SENDGRID_FROM_EMAIL
    REPLY_TO_EMAIL = settings.SENDGRID_FROM_EMAIL
    
    # إعدادات المحتوى - Content Settings
    SITE_NAME = "A-List Home Professionals"
    BRAND_NAME = "A-List Home Professionals"
    COMPANY_NAME = "A-List Home Professionals"
    
    # إعدادات النطاق - Domain Settings
    FRONTEND_DOMAIN = "alisthomepros.com"
    FRONTEND_URL = f"https://{FRONTEND_DOMAIN}"
    
    # رؤوس البريد الإلكتروني المحسنة - Enhanced Email Headers
    EMAIL_HEADERS = {
        'X-Entity-ID': 'alist-home-professionals',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
        'X-Mailer': 'A-List Home Professionals Platform',
        'X-Priority': '3',  # Normal priority
        'Importance': 'Normal',
    }
    
    # إعدادات إلغاء الاشتراك - Unsubscribe Settings
    @classmethod
    def get_unsubscribe_url(cls, email: str) -> str:
        return f"{cls.FRONTEND_URL}/unsubscribe?email={email}"
    
    # نصائح لتجنب مجلد الرسائل غير المرغوب فيها
    # Tips to avoid spam folder:
    SPAM_PREVENTION_TIPS = [
        "استخدم نطاق مخصص للإرسال - Use custom domain for sending",
        "تجنب الكلمات المثيرة للشك في العنوان - Avoid suspicious words in subject",
        "حافظ على نسبة نص إلى HTML متوازنة - Maintain balanced text to HTML ratio",
        "أضف رابط إلغاء الاشتراك - Include unsubscribe link",
        "استخدم SPF, DKIM, DMARC - Use SPF, DKIM, DMARC authentication",
        "تجنب الروابط المختصرة - Avoid shortened URLs",
        "استخدم عنوان IP مخصص - Use dedicated IP address",
        "راقب معدل الشكاوى - Monitor complaint rates",
    ]
    
    # قوالب العناوين المحسنة - Optimized Subject Templates
    SUBJECT_TEMPLATES = {
        'verification': 'Welcome to A-List Home Professionals - Email Verification',
        'password_reset': 'A-List Home Professionals - Password Reset Request',
        'welcome': 'Welcome to A-List Home Professionals!',
        'notification': 'A-List Home Professionals - Important Update',
    }
    
    # إعدادات المحتوى الآمن - Safe Content Settings
    SAFE_CONTENT_RULES = {
        'max_exclamation_marks': 1,  # حد أقصى علامة تعجب واحدة
        'avoid_all_caps': True,      # تجنب الأحرف الكبيرة فقط
        'max_link_percentage': 30,   # حد أقصى 30% روابط من المحتوى
        'include_text_version': True, # تضمين نسخة نصية
        'balanced_content': True,    # محتوى متوازن
    }

# إعدادات SendGrid المحسنة - Enhanced SendGrid Settings
SENDGRID_ENHANCED_CONFIG = {
    'tracking_settings': {
        'click_tracking': {'enable': True, 'enable_text': False},
        'open_tracking': {'enable': True},
        'subscription_tracking': {
            'enable': True
        }
    },
    'mail_settings': {
        'footer': {
            'enable': False
        },
        'spam_check': {
            'enable': True,
            'threshold': 5
        }
    }
}