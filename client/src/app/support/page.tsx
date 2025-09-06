'use client';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-dark-900 mb-4">Support Center</h1>
        <p className="text-gray-600 mb-8">Live chat support coming soon</p>
        <a href="/contact" className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200">
          Contact Us Instead
        </a>
      </div>
    </div>
  );
} 