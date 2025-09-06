from django.core.management.base import BaseCommand
from django.db import transaction
from location_services.models import Country, City


class Command(BaseCommand):
    """
    أمر إدارة لتعبئة البيانات الأولية للدول والمدن
    """
    help = 'تعبئة البيانات الأولية للدول والمدن'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='مسح البيانات الموجودة قبل التعبئة',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('بدء تعبئة البيانات الأولية للمواقع...')
        )

        if options['clear']:
            self.clear_existing_data()

        with transaction.atomic():
            self.create_countries_and_cities()

        self.stdout.write(
            self.style.SUCCESS('تم تعبئة البيانات الأولية بنجاح!')
        )

    def clear_existing_data(self):
        """مسح البيانات الموجودة"""
        self.stdout.write('مسح البيانات الموجودة...')
        City.objects.all().delete()
        Country.objects.all().delete()
        self.stdout.write(self.style.WARNING('تم مسح البيانات الموجودة'))

    def create_countries_and_cities(self):
        """إنشاء الدول والمدن"""
        
        # بيانات الدول والمدن
        countries_data = {
            'مصر': {
                'code': 'EGY',
                'currency': 'EGP',
                'cities': [
                    {'name': 'القاهرة', 'lat': 30.0444, 'lng': 31.2357, 'timezone': 'Africa/Cairo'},
                    {'name': 'الإسكندرية', 'lat': 31.2001, 'lng': 29.9187, 'timezone': 'Africa/Cairo'},
                    {'name': 'الجيزة', 'lat': 30.0131, 'lng': 31.2089, 'timezone': 'Africa/Cairo'},
                    {'name': 'شبرا الخيمة', 'lat': 30.1281, 'lng': 31.2441, 'timezone': 'Africa/Cairo'},
                    {'name': 'بورسعيد', 'lat': 31.2653, 'lng': 32.3019, 'timezone': 'Africa/Cairo'},
                    {'name': 'السويس', 'lat': 29.9668, 'lng': 32.5498, 'timezone': 'Africa/Cairo'},
                    {'name': 'الأقصر', 'lat': 25.6872, 'lng': 32.6396, 'timezone': 'Africa/Cairo'},
                    {'name': 'أسوان', 'lat': 24.0889, 'lng': 32.8998, 'timezone': 'Africa/Cairo'},
                    {'name': 'المنيا', 'lat': 28.0871, 'lng': 30.7618, 'timezone': 'Africa/Cairo'},
                    {'name': 'طنطا', 'lat': 30.7865, 'lng': 31.0004, 'timezone': 'Africa/Cairo'},
                ]
            },
            'السعودية': {
                'code': 'SAU',
                'currency': 'SAR',
                'cities': [
                    {'name': 'الرياض', 'lat': 24.7136, 'lng': 46.6753, 'timezone': 'Asia/Riyadh'},
                    {'name': 'جدة', 'lat': 21.4858, 'lng': 39.1925, 'timezone': 'Asia/Riyadh'},
                    {'name': 'مكة المكرمة', 'lat': 21.3891, 'lng': 39.8579, 'timezone': 'Asia/Riyadh'},
                    {'name': 'المدينة المنورة', 'lat': 24.5247, 'lng': 39.5692, 'timezone': 'Asia/Riyadh'},
                    {'name': 'الدمام', 'lat': 26.4282, 'lng': 50.0888, 'timezone': 'Asia/Riyadh'},
                    {'name': 'الخبر', 'lat': 26.2172, 'lng': 50.1971, 'timezone': 'Asia/Riyadh'},
                    {'name': 'تبوك', 'lat': 28.3838, 'lng': 36.5550, 'timezone': 'Asia/Riyadh'},
                    {'name': 'بريدة', 'lat': 26.3260, 'lng': 43.9750, 'timezone': 'Asia/Riyadh'},
                ]
            },
            'الإمارات': {
                'code': 'UAE',
                'currency': 'AED',
                'cities': [
                    {'name': 'دبي', 'lat': 25.2048, 'lng': 55.2708, 'timezone': 'Asia/Dubai'},
                    {'name': 'أبوظبي', 'lat': 24.2992, 'lng': 54.6973, 'timezone': 'Asia/Dubai'},
                    {'name': 'الشارقة', 'lat': 25.3573, 'lng': 55.4033, 'timezone': 'Asia/Dubai'},
                    {'name': 'عجمان', 'lat': 25.4052, 'lng': 55.5136, 'timezone': 'Asia/Dubai'},
                    {'name': 'رأس الخيمة', 'lat': 25.7889, 'lng': 55.9598, 'timezone': 'Asia/Dubai'},
                    {'name': 'الفجيرة', 'lat': 25.1164, 'lng': 56.3267, 'timezone': 'Asia/Dubai'},
                    {'name': 'أم القيوين', 'lat': 25.5206, 'lng': 55.7324, 'timezone': 'Asia/Dubai'},
                ]
            },
            'الكويت': {
                'code': 'KWT',
                'currency': 'KWD',
                'cities': [
                    {'name': 'مدينة الكويت', 'lat': 29.3759, 'lng': 47.9774, 'timezone': 'Asia/Kuwait'},
                    {'name': 'حولي', 'lat': 29.3375, 'lng': 48.0281, 'timezone': 'Asia/Kuwait'},
                    {'name': 'الفروانية', 'lat': 29.2975, 'lng': 47.9583, 'timezone': 'Asia/Kuwait'},
                    {'name': 'مبارك الكبير', 'lat': 29.2542, 'lng': 48.0833, 'timezone': 'Asia/Kuwait'},
                    {'name': 'الأحمدي', 'lat': 29.0769, 'lng': 48.0492, 'timezone': 'Asia/Kuwait'},
                    {'name': 'الجهراء', 'lat': 29.3375, 'lng': 47.6581, 'timezone': 'Asia/Kuwait'},
                ]
            },
            'قطر': {
                'code': 'QAT',
                'currency': 'QAR',
                'cities': [
                    {'name': 'الدوحة', 'lat': 25.2854, 'lng': 51.5310, 'timezone': 'Asia/Qatar'},
                    {'name': 'الريان', 'lat': 25.2919, 'lng': 51.4240, 'timezone': 'Asia/Qatar'},
                    {'name': 'أم صلال', 'lat': 25.4058, 'lng': 51.4064, 'timezone': 'Asia/Qatar'},
                    {'name': 'الوكرة', 'lat': 25.1624, 'lng': 51.6030, 'timezone': 'Asia/Qatar'},
                ]
            },
            'البحرين': {
                'code': 'BHR',
                'currency': 'BHD',
                'cities': [
                    {'name': 'المنامة', 'lat': 26.2285, 'lng': 50.5860, 'timezone': 'Asia/Bahrain'},
                    {'name': 'المحرق', 'lat': 26.2700, 'lng': 50.6100, 'timezone': 'Asia/Bahrain'},
                    {'name': 'الرفاع', 'lat': 26.1300, 'lng': 50.5550, 'timezone': 'Asia/Bahrain'},
                    {'name': 'حمد', 'lat': 26.1300, 'lng': 50.4800, 'timezone': 'Asia/Bahrain'},
                ]
            },
            'عُمان': {
                'code': 'OMN',
                'currency': 'OMR',
                'cities': [
                    {'name': 'مسقط', 'lat': 23.5859, 'lng': 58.4059, 'timezone': 'Asia/Muscat'},
                    {'name': 'صلالة', 'lat': 17.0193, 'lng': 54.0924, 'timezone': 'Asia/Muscat'},
                    {'name': 'السيب', 'lat': 23.6700, 'lng': 58.1900, 'timezone': 'Asia/Muscat'},
                    {'name': 'صحار', 'lat': 24.3467, 'lng': 56.7069, 'timezone': 'Asia/Muscat'},
                ]
            },
            'الأردن': {
                'code': 'JOR',
                'currency': 'JOD',
                'cities': [
                    {'name': 'عمان', 'lat': 31.9539, 'lng': 35.9106, 'timezone': 'Asia/Amman'},
                    {'name': 'إربد', 'lat': 32.5556, 'lng': 35.8500, 'timezone': 'Asia/Amman'},
                    {'name': 'الزرقاء', 'lat': 32.0728, 'lng': 36.0908, 'timezone': 'Asia/Amman'},
                    {'name': 'العقبة', 'lat': 29.5267, 'lng': 35.0067, 'timezone': 'Asia/Amman'},
                ]
            },
            'لبنان': {
                'code': 'LBN',
                'currency': 'LBP',
                'cities': [
                    {'name': 'بيروت', 'lat': 33.8886, 'lng': 35.4955, 'timezone': 'Asia/Beirut'},
                    {'name': 'طرابلس', 'lat': 34.4467, 'lng': 35.8397, 'timezone': 'Asia/Beirut'},
                    {'name': 'صيدا', 'lat': 33.5633, 'lng': 35.3650, 'timezone': 'Asia/Beirut'},
                    {'name': 'صور', 'lat': 33.2700, 'lng': 35.2000, 'timezone': 'Asia/Beirut'},
                ]
            },
            'المغرب': {
                'code': 'MAR',
                'currency': 'MAD',
                'cities': [
                    {'name': 'الدار البيضاء', 'lat': 33.5731, 'lng': -7.5898, 'timezone': 'Africa/Casablanca'},
                    {'name': 'الرباط', 'lat': 34.0209, 'lng': -6.8416, 'timezone': 'Africa/Casablanca'},
                    {'name': 'فاس', 'lat': 34.0181, 'lng': -5.0078, 'timezone': 'Africa/Casablanca'},
                    {'name': 'مراكش', 'lat': 31.6295, 'lng': -7.9811, 'timezone': 'Africa/Casablanca'},
                    {'name': 'طنجة', 'lat': 35.7595, 'lng': -5.8340, 'timezone': 'Africa/Casablanca'},
                    {'name': 'أغادير', 'lat': 30.4278, 'lng': -9.5981, 'timezone': 'Africa/Casablanca'},
                ]
            }
        }

        # إنشاء الدول والمدن
        for country_name, country_info in countries_data.items():
            self.stdout.write(f'إنشاء دولة: {country_name}')
            
            country, created = Country.objects.get_or_create(
                name=country_name,
                defaults={
                    'code': country_info['code'],
                    'currency': country_info['currency'],
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ تم إنشاء دولة: {country_name}')
                )
            else:
                self.stdout.write(f'• دولة موجودة: {country_name}')

            # إنشاء المدن
            for city_info in country_info['cities']:
                city, created = City.objects.get_or_create(
                    name=city_info['name'],
                    country=country,
                    defaults={
                        'latitude': city_info['lat'],
                        'longitude': city_info['lng'],
                        'timezone': city_info['timezone'],
                        'is_active': True
                    }
                )
                
                if created:
                    self.stdout.write(f'  ✓ تم إنشاء مدينة: {city_info["name"]}')

        # إحصائيات نهائية
        countries_count = Country.objects.count()
        cities_count = City.objects.count()
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=== إحصائيات نهائية ==='))
        self.stdout.write(f'إجمالي الدول: {countries_count}')
        self.stdout.write(f'إجمالي المدن: {cities_count}')
        self.stdout.write('') 