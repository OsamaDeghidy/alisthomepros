import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield,
  Users,
  CreditCard,
  CheckCircle,
  Star,
  ArrowRight,
  ThumbsUp,
  AlertCircle,
  BadgeCheck,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-100 blur-2xl opacity-40"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-100 blur-2xl opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Hero Copy */}
            <div className="text-center lg:text-left">
              <h1 className="font-heading font-bold tracking-tight text-4xl lg:text-6xl text-dark-900 mb-6">
                A-List Home Professionals
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 max-w-3xl leading-relaxed mb-10 mx-auto lg:mx-0">
                Connect with trusted home improvement professionals. Get quality work done right, on time, and within budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/post-project"
                  className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all duration-200"
                >
                  Post Your Project
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Link>
                <Link
                  href="/find-work"
                  className="inline-flex items-center justify-center bg-white border border-gray-300 text-dark-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Find Work
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Link>
              </div>
              {/* Trust Badges */}
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-6 text-gray-700">
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="h-5 w-5 text-primary-600" aria-hidden />
                  <span className="text-sm">Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-primary-600" aria-hidden />
                  <span className="text-sm">Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-primary-600" aria-hidden />
                  <span className="text-sm">Satisfaction Guarantee</span>
                </div>
              </div>
              {/* Trusted by logos */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Trusted by</p>
                <div className="flex flex-wrap items-center gap-6 opacity-80">
                  <Image src="/images/trust/homeadvisor.svg" alt="HomeAdvisor" width={110} height={28} className="h-7 w-auto" />
                  <Image src="/images/trust/angies-list.svg" alt="Angie's List" width={110} height={28} className="h-7 w-auto" />
                  <Image src="/images/trust/bbb.svg" alt="Better Business Bureau" width={110} height={28} className="h-7 w-auto" />
                  <Image src="/images/trust/florida-contractors.svg" alt="Florida Contractors" width={140} height={28} className="h-7 w-auto" />
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 blur-2xl rounded-full opacity-50" aria-hidden></div>
              <Image
                src="/images/proxy-image.jpg"
                alt="Experienced home improvement professional at work"
                width={900}
                height={700}
                priority
                className="rounded-2xl shadow-2xl ring-1 ring-gray-200 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 mb-6">
              Why Choose A-List Home Pros?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive platform that connects homeowners with trusted professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <BadgeCheck className="h-8 w-8 text-primary-600" aria-hidden />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">
                Verified Professionals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All professionals are background-checked, licensed, and insured for your peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-primary-600" aria-hidden />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">
                Secure Payments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our escrow system protects your funds until work is completed to your satisfaction.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-primary-600" aria-hidden />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">
                Quality Assurance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our review system and quality processes ensure you get the best service every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction Guarantee Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Satisfaction Guarantee
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 mb-6">
              We Guarantee Your 
              <span className="text-primary-600"> Satisfaction</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your satisfaction is our priority. We provide effective dispute resolution and quality assurance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Satisfaction Guarantee */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-6">
                  <ThumbsUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900">Satisfaction Guarantee</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Escrow Protection</p>
                    <p className="text-gray-600">Funds are held securely until work is completed satisfactorily</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Quality Standards</p>
                    <p className="text-gray-600">All projects must meet agreed quality standards before payment release</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Review Period</p>
                    <p className="text-gray-600">Adequate time to review completed work and ensure specifications are met</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-6">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900">Dispute Resolution</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Professional Mediation</p>
                    <p className="text-gray-600">Specialized team helps resolve disputes fairly between clients and professionals</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Transparent Process</p>
                    <p className="text-gray-600">Clear and transparent procedures for filing complaints and tracking resolution</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Quick Solutions</p>
                    <p className="text-gray-600">We strive to resolve all disputes within 7 business days</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of homeowners and professionals who trust A-List Home Pros for their projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-project"
              className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all duration-200 inline-flex items-center"
            >
              Post Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="bg-white border border-gray-300 text-dark-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Join as Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
