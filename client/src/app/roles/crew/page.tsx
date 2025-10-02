'use client';

import { Shield, CheckCircle, AlertTriangle, DollarSign, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CrewRolePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">لطاقم العمل: فرص عمل مستقرة وعادلة</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold mb-4">كعضو في طاقم العمل على منصتنا، ستحصل على:</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">فرص عمل منتظمة</span>
                <p className="text-gray-600">اتصل بمهنيين محترفين يحتاجون إلى طاقم عمل موثوق للمشاريع المختلفة.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">مدفوعات مضمونة</span>
                <p className="text-gray-600">نظام الضمان المالي يضمن حصولك على أجرك في الوقت المحدد.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">جدول عمل مرن</span>
                <p className="text-gray-600">اختر المشاريع التي تناسب جدولك وخبراتك.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">تطوير المهارات والخبرات</span>
                <p className="text-gray-600">اعمل مع مهنيين محترفين واكتسب خبرات متنوعة في مجال البناء والتشييد.</p>
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
                <Shield className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">ضمان الدفع لساعات عملك</h3>
              </div>
              <p className="text-gray-700 mb-6">
                على عكس العمل المباشر مع المقاولين حيث قد تواجه تأخيرًا في الدفع، يضمن نظام الضمان المالي لدينا حصولك على مستحقاتك في الوقت المحدد.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تسجيل ساعات العمل</h4>
                    <p className="text-gray-600">سجل ساعات عملك من خلال نظام تتبع الوقت الخاص بنا.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">موافقة المهني المحترف</h4>
                    <p className="text-gray-600">يقوم المهني المحترف بمراجعة والموافقة على ساعات عملك.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">ضمان الدفع</h4>
                    <p className="text-gray-600">يتم تأمين مدفوعاتك من خلال نظام الضمان المالي للمشروع.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">استلام المدفوعات</h4>
                    <p className="text-gray-600">تستلم مدفوعاتك في المواعيد المحددة بغض النظر عن موعد دفع العميل للمهني.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* جدول المقارنة */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">لماذا نحن أفضل من العمل التقليدي</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">الميزة</th>
                  <th className="py-3 px-4 text-center">منصتنا</th>
                  <th className="py-3 px-4 text-center">العمل التقليدي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">ضمان الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>مضمون من خلال نظام الضمان المالي</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>غير مضمون وقد يتأخر</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">استقرار العمل</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>فرص متنوعة ومستمرة</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>غير مستقر ويعتمد على المقاول</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">المرونة</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>اختيار المشاريع والجدول المناسب</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>جدول ثابت وخيارات محدودة</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">تتبع ساعات العمل</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>نظام تتبع رقمي دقيق وشفاف</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>تتبع يدوي قد يكون غير دقيق</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">تطوير المهارات</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>فرص للعمل مع مهنيين متنوعين</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>محدود بخبرة المقاول الواحد</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* دعوة للعمل */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز للانضمام إلى فريقنا؟</h2>
          <p className="text-xl mb-6">سجل الآن وابدأ في الحصول على فرص عمل مستقرة ومضمونة الدفع</p>
          <Link href="/register" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition duration-300">
            انضم كعضو طاقم عمل
          </Link>
        </div>
      </div>
    </div>
  );
}