'use client';

import { Shield, CheckCircle, AlertTriangle, Star, Briefcase, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SpecialistRolePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">للمتخصصين: فرص مهنية استثنائية</h1>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold mb-4">كمتخصص على منصتنا، ستحصل على:</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">مشاريع عالية القيمة</span>
                <p className="text-gray-600">اتصل بعملاء يبحثون عن خبرات متخصصة ومستعدين لدفع قيمة مناسبة لخبرتك.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">حماية مالية كاملة</span>
                <p className="text-gray-600">نظام الضمان المالي يضمن حصولك على مستحقاتك بالكامل وفي الوقت المحدد.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">إبراز خبراتك المتخصصة</span>
                <p className="text-gray-600">منصة تقدر وتبرز مهاراتك المتخصصة وتساعدك في الوصول للعملاء المناسبين.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">استقلالية العمل</span>
                <p className="text-gray-600">حدد أسعارك وجدولك وشروط عملك بنفسك، مع الاستفادة من منصة تدعم نموك المهني.</p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* نظام الضمان المالي */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">كيف يحميك نظام الضمان المالي</h2>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-10 w-10 text-purple-600 mr-4" />
                <h3 className="text-xl font-semibold">ضمان الدفع لخدماتك المتخصصة</h3>
              </div>
              <p className="text-gray-700 mb-6">
                على عكس العمل المباشر مع العملاء حيث قد تواجه مشكلات في التحصيل، يضمن نظام الضمان المالي لدينا حصولك على مستحقاتك كاملة.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تقديم عرض السعر</h4>
                    <p className="text-gray-600">قدم عرض سعرك للمشروع بناءً على متطلبات العميل المحددة.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تأمين المبلغ</h4>
                    <p className="text-gray-600">عند قبول العرض، يقوم العميل بإيداع المبلغ في نظام الضمان المالي.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تنفيذ العمل بأمان</h4>
                    <p className="text-gray-600">قم بتنفيذ العمل مع العلم أن المبلغ مؤمن ومحجوز لصالحك.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">استلام المدفوعات</h4>
                    <p className="text-gray-600">بعد موافقة العميل على العمل، يتم تحويل المبلغ إلى حسابك مباشرة.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* جدول المقارنة */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">لماذا نحن أفضل من منصات Angi/Thumbtack</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-right">الميزة</th>
                  <th className="py-3 px-4 text-center">منصتنا</th>
                  <th className="py-3 px-4 text-center">منصات الدفع لكل عميل محتمل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">نموذج الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
                      <span>عمولة فقط عند إتمام المشروع بنجاح</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 ml-1" />
                      <span>دفع لكل عميل محتمل بغض النظر عن النتيجة</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">ضمان الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
                      <span>نظام ضمان مالي كامل</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 ml-1" />
                      <span>لا يوجد ضمان للدفع</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">جودة العملاء</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
                      <span>عملاء جادون مع مشاريع محددة</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 ml-1" />
                      <span>عملاء محتملون قد لا يكونون جادين</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">تحديد الأسعار</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
                      <span>حرية كاملة في تحديد أسعارك</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 ml-1" />
                      <span>ضغط مستمر لخفض الأسعار للمنافسة</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">إبراز التخصص</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
                      <span>تسويق مخصص للمهارات المتخصصة</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 ml-1" />
                      <span>تصنيف عام لا يبرز التخصصات الدقيقة</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* دعوة للعمل */}
        <div className="bg-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لعرض خبراتك المتخصصة؟</h2>
          <p className="text-xl mb-6">سجل الآن وابدأ في استقبال مشاريع تناسب تخصصك وتقدر قيمة خبرتك</p>
          <Link href="/register" className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition duration-300">
            انضم كمتخصص
          </Link>
        </div>
      </div>
    </div>
  );
}