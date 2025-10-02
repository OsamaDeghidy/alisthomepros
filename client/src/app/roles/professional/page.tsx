'use client';

import { Shield, CheckCircle, AlertTriangle, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfessionalRolePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">للمهنيين: نمِّ أعمالك مع عملاء جادين</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold mb-4">كمهني في منصتنا، ستحصل على:</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">عملاء جادين وجاهزين للتعاقد</span>
                <p className="text-gray-600">تقدم عروضك لعملاء جادين لديهم مشاريع حقيقية وميزانيات محددة.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">ضمان الدفع</span>
                <p className="text-gray-600">نظام الضمان المالي يضمن حصولك على مستحقاتك بعد إكمال العمل.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">لا رسوم على العملاء المحتملين</span>
                <p className="text-gray-600">ادفع فقط نسبة صغيرة من المشاريع المكتملة، وليس مقابل العملاء المحتملين.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">بناء سمعة قوية</span>
                <p className="text-gray-600">اكسب تقييمات وتوصيات من العملاء لتعزيز مكانتك في السوق.</p>
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
                <h3 className="text-xl font-semibold">ضمان الدفع لخدماتك</h3>
              </div>
              <p className="text-gray-700 mb-6">
                على عكس العمل المباشر مع العملاء حيث قد تواجه مشكلات في التحصيل، يضمن نظام الضمان المالي لدينا حصولك على مستحقاتك بعد إكمال العمل.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تأمين المشروع</h4>
                    <p className="text-gray-600">يقوم العميل بإيداع المبلغ المتفق عليه في حساب الضمان قبل بدء العمل.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تنفيذ المشروع بثقة</h4>
                    <p className="text-gray-600">اعمل وأنت مطمئن أن المبلغ مؤمن ومحجوز لمشروعك.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تسليم العمل</h4>
                    <p className="text-gray-600">قم بتسليم العمل للعميل للمراجعة والموافقة.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">استلام المدفوعات</h4>
                    <p className="text-gray-600">بعد موافقة العميل، يتم تحرير الدفعة لك مباشرة.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* جدول المقارنة */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">لماذا نحن أفضل من المنصات الأخرى للمهنيين</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">الميزة</th>
                  <th className="py-3 px-4 text-center">منصتنا</th>
                  <th className="py-3 px-4 text-center">Angi / Thumbtack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">نموذج الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>عمولة صغيرة على المشاريع المكتملة فقط</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>رسوم عالية لكل عميل محتمل</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">جودة العملاء</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>عملاء جادون مع ميزانيات محددة</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>عملاء محتملون غير مؤكدين</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">ضمان الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>نظام ضمان مالي كامل</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>لا يوجد ضمان للدفع</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">المخاطر المالية</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>منخفضة - تدفع فقط عند إكمال المشروع</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>عالية - تدفع مقدمًا لعملاء محتملين</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">بناء العلامة التجارية</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>ملف تعريف احترافي وتقييمات موثقة</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>محدود</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* دعوة للعمل */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لتنمية أعمالك؟</h2>
          <p className="text-xl mb-6">سجل الآن وابدأ في تلقي مشاريع من عملاء جادين</p>
          <Link href="/register" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition duration-300">
            انضم كمهني محترف
          </Link>
        </div>
      </div>
    </div>
  );
}