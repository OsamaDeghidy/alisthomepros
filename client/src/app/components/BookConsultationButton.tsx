'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import dynamic from 'next/dynamic';

// استيراد المكون بشكل ديناميكي لتجنب مشاكل التحميل على جانب الخادم
const BookConsultationModal = dynamic(
  () => import('./BookConsultationModal'),
  { ssr: false }
);

export default function BookConsultationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-md"
      >
        <Phone className="h-5 w-5 mr-2" />
        <span>احجز مكالمة استشارية</span>
      </button>

      {isModalOpen && (
        <BookConsultationModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </>
  );
}