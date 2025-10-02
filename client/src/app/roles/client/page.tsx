'use client';

import { Shield, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientRolePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">للعملاء: احصل على خدمات منزلية موثوقة</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold mb-4">كعميل في منصتنا، ستحصل على:</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">مهنيين مُتحقق منهم</span>
                <p className="text-gray-600">جميع المهنيين على منصتنا تم التحقق من هويتهم، تراخيصهم، وتأمينهم.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">نظام الضمان المالي (Escrow)</span>
                <p className="text-gray-600">أموالك محمية في حساب ضمان آمن ولا يتم تحريرها إلا بعد اكتمال العمل ورضاك عنه.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">عروض أسعار مجانية</span>
                <p className="text-gray-600">احصل على عروض أسعار متعددة من مهنيين مؤهلين دون أي تكلفة.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <div>
                <span className="font-medium">ضمان الرضا</span>
                <p className="text-gray-600">إذا لم تكن راضيًا عن العمل، فإن عملية حل النزاعات لدينا تضمن حصولك على حل عادل.</p>
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
                <h3 className="text-xl font-semibold">حماية مالية كاملة</h3>
              </div>
              <p className="text-gray-700 mb-6">
                على عكس المنصات الأخرى التي تترك التعاملات المالية بينك وبين المهني، نظام الضمان المالي لدينا يحمي أموالك حتى اكتمال العمل بشكل مرضٍ.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">إيداع الدفعة في حساب الضمان</h4>
                    <p className="text-gray-600">تقوم بإيداع المبلغ المتفق عليه في حساب ضمان آمن تديره منصتنا.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تنفيذ المشروع</h4>
                    <p className="text-gray-600">يقوم المهني بتنفيذ العمل مع العلم أن الدفعة مضمونة.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">مراجعة واعتماد</h4>
                    <p className="text-gray-600">تقوم بمراجعة العمل المنجز والموافقة عليه إذا كان مرضيًا.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">تحرير الدفعة</h4>
                    <p className="text-gray-600">بعد موافقتك، يتم تحرير الدفعة للمهني من حساب الضمان.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* جدول المقارنة */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">لماذا نحن أفضل من المنصات الأخرى</h2>
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
                      <span>دفع مقابل المشروع المكتمل</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>دفع مقابل العملاء المحتملين</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">حماية الدفع</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>نظام ضمان مالي كامل</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>لا يوجد ضمان مالي</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">التحقق من المهنيين</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>تحقق شامل من الهوية والتراخيص والتأمين</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>تحقق محدود</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">حل النزاعات</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>عملية رسمية لحل النزاعات</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>محدود أو غير متوفر</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">رسوم المنصة</td>
                  <td className="py-3 px-4 text-center bg-green-50">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span>نسبة صغيرة من المشاريع المكتملة فقط</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center bg-red-50">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                      <span>رسوم عالية لكل عميل محتمل</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* دعوة للعمل */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-xl mb-6">انشر مشروعك الآن واحصل على عروض من مهنيين موثوقين</p>
          <Link href="/post-project" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition duration-300">
            نشر مشروع جديد
          </Link>
        </div>
      </div>
    </div>
  );
}