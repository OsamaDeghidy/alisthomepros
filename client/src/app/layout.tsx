import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "A-List Home Professionals - Find Trusted Home Improvement Experts",
  description: "Connect with skilled home improvement professionals. From contractors to consultants, find the right expertise for your home projects. Quality guaranteed.",
  keywords: "home improvement, contractors, home professionals, renovation, repair, construction",
  authors: [{ name: "A-List Home Professionals" }],
  creator: "A-List Home Professionals",
  publisher: "A-List Home Professionals",
  openGraph: {
    title: "A-List Home Professionals",
    description: "Connect with trusted home improvement professionals",
    url: "https://alisthomepros.com",
    siteName: "A-List Home Professionals",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "A-List Home Professionals",
    description: "Connect with trusted home improvement professionals",
    creator: "@alisthomepros",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
