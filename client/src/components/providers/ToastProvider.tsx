'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // إعدادات افتراضية للإشعارات
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          direction: 'rtl',
          fontFamily: 'inherit',
        },
        // إعدادات الإشعارات الناجحة
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
          },
        },
        // إعدادات إشعارات الخطأ
        error: {
          duration: 5000,
          style: {
            background: '#ef4444',
          },
        },
        // إعدادات إشعارات التحميل
        loading: {
          style: {
            background: '#3b82f6',
          },
        },
      }}
    />
  );
}