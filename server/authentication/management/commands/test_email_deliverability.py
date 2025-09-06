from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from authentication.sendgrid_service import sendgrid_service
from authentication.models import EmailVerificationToken
import os
from django.conf import settings

User = get_user_model()

class Command(BaseCommand):
    help = 'اختبار تحسينات قابلية تسليم البريد الإلكتروني'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='البريد الإلكتروني للاختبار',
            default='test@example.com'
        )

    def handle(self, *args, **options):
        test_email = options['email']
        
        self.stdout.write(
            self.style.SUCCESS('🚀 بدء اختبار تحسينات قابلية تسليم البريد الإلكتروني')
        )
        self.stdout.write('=' * 60)
        
        # فحص الإعدادات
        if not self.check_sendgrid_configuration():
            self.stdout.write(
                self.style.ERROR('❌ فشل في فحص إعدادات SendGrid')
            )
            return
        
        self.stdout.write('\n' + '=' * 60)
        
        # تشغيل الاختبارات
        results = []
        results.append(self.test_verification_email(test_email))
        results.append(self.test_password_reset_email(test_email))
        results.append(self.test_welcome_email(test_email))
        
        # عرض النتائج
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write('📊 ملخص النتائج:')
        self.stdout.write(f'✅ اختبارات ناجحة: {sum(results)}')
        self.stdout.write(f'❌ اختبارات فاشلة: {len(results) - sum(results)}')
        
        if all(results):
            self.stdout.write(
                self.style.SUCCESS('\n🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام.')
            )
            self.stdout.write('\n📝 تعليمات مهمة:')
            self.stdout.write('1. تحقق من صندوق الوارد والرسائل غير المرغوب فيها')
            self.stdout.write('2. تأكد من وصول الرسائل إلى صندوق الوارد الرئيسي')
            self.stdout.write('3. اختبر الروابط في الرسائل للتأكد من عملها')
            self.stdout.write('4. راقب إحصائيات SendGrid لمعدلات التسليم')
        else:
            self.stdout.write(
                self.style.WARNING('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.')
            )

    def check_sendgrid_configuration(self):
        """فحص إعدادات SendGrid"""
        self.stdout.write('🔧 فحص إعدادات SendGrid...')
        
        api_key = os.getenv('SENDGRID_API_KEY')
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
        
        if not api_key:
            self.stdout.write(
                self.style.ERROR('❌ SENDGRID_API_KEY غير محدد في متغيرات البيئة')
            )
            return False
        
        if not from_email:
            self.stdout.write(
                self.style.ERROR('❌ DEFAULT_FROM_EMAIL غير محدد في الإعدادات')
            )
            return False
        
        self.stdout.write(f'✅ SENDGRID_API_KEY: {"*" * (len(api_key) - 4) + api_key[-4:]}')
        self.stdout.write(f'✅ FROM_EMAIL: {from_email}')
        
        if sendgrid_service.client:
            self.stdout.write('✅ SendGrid client تم تهيئته بنجاح')
            sandbox_status = 'مفعل' if sendgrid_service.sandbox_mode else 'معطل'
            self.stdout.write(f'🧪 وضع Sandbox: {sandbox_status}')
            return True
        else:
            self.stdout.write(
                self.style.ERROR('❌ فشل في تهيئة SendGrid client')
            )
            return False

    def test_verification_email(self, test_email):
        """اختبار إرسال بريد التحقق"""
        self.stdout.write('\n🧪 اختبار إرسال بريد التحقق من البريد الإلكتروني...')
        
        try:
            user = User.objects.get(email=test_email)
            self.stdout.write(f'✅ تم العثور على المستخدم: {user.username}')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}'
                )
            )
            self.stdout.write('يرجى استخدام --email مع بريد إلكتروني موجود')
            return False
        
        # إنشاء رمز التحقق
        verification_token = EmailVerificationToken.objects.create(
            user=user
        )
        
        # إرسال البريد الإلكتروني
        email_log = sendgrid_service.send_verification_email(user, verification_token)
        
        if email_log and email_log.status == 'sent':
            self.stdout.write(
                self.style.SUCCESS(f'✅ تم إرسال بريد التحقق بنجاح إلى {user.email}')
            )
            self.stdout.write(f'📧 معرف الرسالة: {email_log.provider_message_id}')
            self.stdout.write(f'🕒 وقت الإرسال: {email_log.sent_at}')
            return True
        else:
            self.stdout.write(
                self.style.ERROR(f'❌ فشل في إرسال بريد التحقق إلى {user.email}')
            )
            if email_log:
                self.stdout.write(f'📝 رسالة الخطأ: {email_log.error_message}')
            return False

    def test_password_reset_email(self, test_email):
        """اختبار إرسال بريد إعادة تعيين كلمة المرور"""
        self.stdout.write('\n🧪 اختبار إرسال بريد إعادة تعيين كلمة المرور...')
        
        try:
            user = User.objects.get(email=test_email)
            self.stdout.write(f'✅ تم العثور على المستخدم: {user.username}')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}'
                )
            )
            return False
        
        # إنشاء رمز إعادة التعيين (مؤقت للاختبار)
        reset_token = 'test-reset-token-123456'
        
        # إرسال البريد الإلكتروني
        email_log = sendgrid_service.send_password_reset_email(user, reset_token)
        
        if email_log and email_log.status == 'sent':
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ تم إرسال بريد إعادة تعيين كلمة المرور بنجاح إلى {user.email}'
                )
            )
            self.stdout.write(f'📧 معرف الرسالة: {email_log.provider_message_id}')
            self.stdout.write(f'🕒 وقت الإرسال: {email_log.sent_at}')
            return True
        else:
            self.stdout.write(
                self.style.ERROR(
                    f'❌ فشل في إرسال بريد إعادة تعيين كلمة المرور إلى {user.email}'
                )
            )
            if email_log:
                self.stdout.write(f'📝 رسالة الخطأ: {email_log.error_message}')
            return False

    def test_welcome_email(self, test_email):
        """اختبار إرسال بريد الترحيب"""
        self.stdout.write('\n🧪 اختبار إرسال بريد الترحيب...')
        
        try:
            user = User.objects.get(email=test_email)
            self.stdout.write(f'✅ تم العثور على المستخدم: {user.username}')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}'
                )
            )
            return False
        
        # إرسال البريد الإلكتروني
        email_log = sendgrid_service.send_welcome_email(user)
        
        if email_log and email_log.status == 'sent':
            self.stdout.write(
                self.style.SUCCESS(f'✅ تم إرسال بريد الترحيب بنجاح إلى {user.email}')
            )
            self.stdout.write(f'📧 معرف الرسالة: {email_log.provider_message_id}')
            self.stdout.write(f'🕒 وقت الإرسال: {email_log.sent_at}')
            return True
        else:
            self.stdout.write(
                self.style.ERROR(f'❌ فشل في إرسال بريد الترحيب إلى {user.email}')
            )
            if email_log:
                self.stdout.write(f'📝 رسالة الخطأ: {email_log.error_message}')
            return False