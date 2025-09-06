#!/usr/bin/env python
"""
اختبار تحسينات قابلية تسليم البريد الإلكتروني
هذا الملف يختبر النظام المحسن لإرسال رسائل البريد الإلكتروني
"""

import os
import sys
import django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from authentication.sendgrid_service import sendgrid_service
from authentication.models import EmailVerificationToken

User = get_user_model()

def test_verification_email():
    """
    اختبار إرسال بريد التحقق من البريد الإلكتروني
    """
    print("🧪 اختبار إرسال بريد التحقق من البريد الإلكتروني...")
    
    # البحث عن مستخدم للاختبار أو إنشاء واحد
    test_email = "test@example.com"  # غير هذا إلى بريدك الإلكتروني للاختبار
    
    try:
        user = User.objects.get(email=test_email)
        print(f"✅ تم العثور على المستخدم: {user.username}")
    except User.DoesNotExist:
        print(f"⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}")
        print("يرجى تغيير test_email في الكود إلى بريد إلكتروني موجود في النظام")
        return False
    
    # إنشاء رمز التحقق
    verification_token = EmailVerificationToken.objects.create(
        user=user,
        email=user.email
    )
    
    # إرسال البريد الإلكتروني
    email_log = sendgrid_service.send_verification_email(user, verification_token.token)
    
    if email_log and email_log.status == 'sent':
        print(f"✅ تم إرسال بريد التحقق بنجاح إلى {user.email}")
        print(f"📧 معرف الرسالة: {email_log.provider_message_id}")
        print(f"🕒 وقت الإرسال: {email_log.sent_at}")
        return True
    else:
        print(f"❌ فشل في إرسال بريد التحقق إلى {user.email}")
        if email_log:
            print(f"📝 رسالة الخطأ: {email_log.error_message}")
        return False

def test_password_reset_email():
    """
    اختبار إرسال بريد إعادة تعيين كلمة المرور
    """
    print("\n🧪 اختبار إرسال بريد إعادة تعيين كلمة المرور...")
    
    test_email = "test@example.com"  # غير هذا إلى بريدك الإلكتروني للاختبار
    
    try:
        user = User.objects.get(email=test_email)
        print(f"✅ تم العثور على المستخدم: {user.username}")
    except User.DoesNotExist:
        print(f"⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}")
        return False
    
    # إنشاء رمز إعادة التعيين (مؤقت للاختبار)
    reset_token = "test-reset-token-123456"
    
    # إرسال البريد الإلكتروني
    email_log = sendgrid_service.send_password_reset_email(user, reset_token)
    
    if email_log and email_log.status == 'sent':
        print(f"✅ تم إرسال بريد إعادة تعيين كلمة المرور بنجاح إلى {user.email}")
        print(f"📧 معرف الرسالة: {email_log.provider_message_id}")
        print(f"🕒 وقت الإرسال: {email_log.sent_at}")
        return True
    else:
        print(f"❌ فشل في إرسال بريد إعادة تعيين كلمة المرور إلى {user.email}")
        if email_log:
            print(f"📝 رسالة الخطأ: {email_log.error_message}")
        return False

def test_welcome_email():
    """
    اختبار إرسال بريد الترحيب
    """
    print("\n🧪 اختبار إرسال بريد الترحيب...")
    
    test_email = "test@example.com"  # غير هذا إلى بريدك الإلكتروني للاختبار
    
    try:
        user = User.objects.get(email=test_email)
        print(f"✅ تم العثور على المستخدم: {user.username}")
    except User.DoesNotExist:
        print(f"⚠️ لم يتم العثور على مستخدم بالبريد الإلكتروني {test_email}")
        return False
    
    # إرسال البريد الإلكتروني
    email_log = sendgrid_service.send_welcome_email(user)
    
    if email_log and email_log.status == 'sent':
        print(f"✅ تم إرسال بريد الترحيب بنجاح إلى {user.email}")
        print(f"📧 معرف الرسالة: {email_log.provider_message_id}")
        print(f"🕒 وقت الإرسال: {email_log.sent_at}")
        return True
    else:
        print(f"❌ فشل في إرسال بريد الترحيب إلى {user.email}")
        if email_log:
            print(f"📝 رسالة الخطأ: {email_log.error_message}")
        return False

def check_sendgrid_configuration():
    """
    فحص إعدادات SendGrid
    """
    print("🔧 فحص إعدادات SendGrid...")
    
    # فحص متغيرات البيئة
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
    
    if not api_key:
        print("❌ SENDGRID_API_KEY غير محدد في متغيرات البيئة")
        return False
    
    if not from_email:
        print("❌ DEFAULT_FROM_EMAIL غير محدد في الإعدادات")
        return False
    
    print(f"✅ SENDGRID_API_KEY: {'*' * (len(api_key) - 4) + api_key[-4:]}")
    print(f"✅ FROM_EMAIL: {from_email}")
    
    # فحص حالة الخدمة
    if sendgrid_service.client:
        print("✅ SendGrid client تم تهيئته بنجاح")
        print(f"🧪 وضع Sandbox: {'مفعل' if sendgrid_service.sandbox_mode else 'معطل'}")
        return True
    else:
        print("❌ فشل في تهيئة SendGrid client")
        return False

def main():
    """
    تشغيل جميع الاختبارات
    """
    print("🚀 بدء اختبار تحسينات قابلية تسليم البريد الإلكتروني\n")
    print("=" * 60)
    
    # فحص الإعدادات أولاً
    if not check_sendgrid_configuration():
        print("\n❌ فشل في فحص إعدادات SendGrid. يرجى التحقق من الإعدادات.")
        return
    
    print("\n" + "=" * 60)
    
    # تشغيل الاختبارات
    tests = [
        test_verification_email,
        test_password_reset_email,
        test_welcome_email
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ خطأ في تشغيل الاختبار: {str(e)}")
            results.append(False)
    
    # عرض النتائج
    print("\n" + "=" * 60)
    print("📊 ملخص النتائج:")
    print(f"✅ اختبارات ناجحة: {sum(results)}")
    print(f"❌ اختبارات فاشلة: {len(results) - sum(results)}")
    
    if all(results):
        print("\n🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام.")
        print("\n📝 تعليمات مهمة:")
        print("1. تحقق من صندوق الوارد والرسائل غير المرغوب فيها")
        print("2. تأكد من وصول الرسائل إلى صندوق الوارد الرئيسي")
        print("3. اختبر الروابط في الرسائل للتأكد من عملها")
        print("4. راقب إحصائيات SendGrid لمعدلات التسليم")
    else:
        print("\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.")

if __name__ == '__main__':
    main()