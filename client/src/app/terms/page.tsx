'use client';

import Link from 'next/link';
import {
  ArrowLeft, FileText, BookOpen, Globe, Users, UserPlus, Briefcase, 
  Link as LinkIcon, ShieldCheck, Info, XCircle, CreditCard, Handshake, 
  Ban, Scale, RefreshCw, Gift, Search, Lock, Eye, MessageSquare, 
  AlertTriangle, ShieldAlert, Gavel, LogOut, Hammer, MapPin, 
  PenTool, Edit3, MoreHorizontal, Mail, ArrowRight, Shield, ShieldAlert as ShieldIcon
} from 'lucide-react';
import { APP_GATEWAY_URL } from '@/config/site';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. ACCEPTANCE OF TERMS',
    body: `Welcome to A-List Home Professionals. These Terms of Service ("Terms") govern your access to and use of the websites at alisthomepros.com and app.alisthomepros.com, any related mobile applications, and any related services (collectively, the "Platform"), provided by A-List Home Professionals, LLC, a Florida limited liability company ("A-List," "Company," "we," "our," or "us").\n\nBy creating an account, accessing, or using the Platform, you agree to be bound by these Terms and by our Privacy Policy, which is incorporated by reference. If you do not agree, you must not access or use the Platform.\n\nThese Terms apply to all users of the Platform, including:\n• A-List Clients (Homeowners)\n• A-List Home Pros\n• A-List Crew Members\n• A-List Specialists\n• A-List Affiliates\n(together, "Users" or "you").`,
  },
  {
    id: 'definitions',
    icon: BookOpen,
    title: '2. DEFINITIONS',
    body: `For purposes of these Terms:\n\n"Client" means an A-List Client (a homeowner or other property owner) who uses the Platform to post Projects and engage Service Providers.\n\n"Crew Member" means an individual skilled laborer who uses the Platform to perform labor on Projects.\n\n"A-List Affiliate" means a User who participates in the A-List Affiliate Program described in Section 16, by personally and directly referring new users to the Platform using the A-List Affiliate's unique referral link or code.\n\n"Home Pro" means a licensed and insured independent home-service contractor who uses the Platform to offer and perform Pro Services on Projects. To register as and maintain the status of a Home Pro, a User must (i) hold all professional licenses, certifications, and registrations required by the state, county, and municipality in which the Home Pro will perform services (including, for Florida Projects requiring such licensure, a license under Fla. Stat. Ch. 489), (ii) maintain commercial general liability insurance and any other insurance required by Section 8, and (iii) comply with the ongoing licensing, insurance, and disclosure covenants in Section 8. A User who does not meet these requirements may not register as a Home Pro and must instead use the Platform in another capacity (such as Crew Member) for which they qualify, where applicable.\n\n"Payment Processor" means Stripe, Inc. or any other licensed third-party payment processor engaged by A-List to process payments on the Platform.\n\n"Platform" has the meaning set forth in Section 1.\n\n"Project" means a home-service project posted by a Client on the Platform.\n\n"Project Funds Account" means the in-Platform payment-tracking mechanism described in Section 11.\n\n"Referred User" means a new user referred to the Platform through an A-List Affiliate's unique referral link or code.\n\n"Service Provider" means, collectively, Home Pros, Crew Members, and Specialists.\n\n"Specialist" means a User who coordinates or manages Projects on the Platform.\n\n"Subscription" means a recurring paid membership plan offered by A-List.`,
  },
  {
    id: 'description',
    icon: Globe,
    title: '3. PLATFORM DESCRIPTION',
    body: `A-List operates a private marketplace and technology platform that connects Clients with independent home-service professionals, skilled labor, project coordinators, and referral partners. The Platform provides tools for:\n• Posting and managing Projects\n• Connecting with Service Providers\n• Facilitating payments through the Project Funds Account\n• Managing communications and workflow\n\nA-List verifies each Service Provider's (i) stated legal name and contact information against government-issued identification, (ii) active professional licenses (where applicable) through the relevant state licensing authority's public records, (iii) proof of commercial general liability insurance, and (iv) public criminal background check consistent with the Fair Credit Reporting Act. Verification is performed at onboarding and periodically thereafter. A-List does not guarantee the accuracy, completeness, or currency of information obtained from third-party sources, nor the workmanship, conduct, or performance of any Service Provider.`,
    warning: `IMPORTANT DISCLAIMER: A-LIST IS NOT A CONTRACTOR, SUBCONTRACTOR, EMPLOYER, GENERAL CONTRACTOR, CONSTRUCTION MANAGER, OR ESCROW AGENT. A-LIST DOES NOT PERFORM, SUPERVISE, DIRECT, OR CONTROL THE SERVICES OFFERED BY ANY SERVICE PROVIDER. ALL SERVICES ARE PERFORMED BY INDEPENDENT THIRD-PARTY SERVICE PROVIDERS. A-LIST IS A PAYMENT FACILITATOR ONLY, AND IS NOT A BANK, TRUST COMPANY, MONEY SERVICES BUSINESS, OR LICENSED ESCROW INSTITUTION.`,
  },
  {
    id: 'eligibility',
    icon: Users,
    title: '4. USER ELIGIBILITY',
    body: `To use the Platform, you must:\n(a) be at least 18 years of age;\n(b) have the legal capacity to enter into a binding contract;\n(c) be a resident of the United States;\n(d) not be a person, or owned or controlled by a person, subject to U.S. Department of the Treasury Office of Foreign Assets Control ("OFAC") sanctions or listed on any U.S. government restricted-party list;\n(e) not have been previously terminated from the Platform for cause; and\n(f) comply with all applicable federal, state, and local laws.\n\nMinors (persons under 18) may not access, register for, or use the Platform in any capacity, including as A-List Affiliates. A-List reserves the right to verify age and identity at any time and to deny access to any person who does not meet these eligibility requirements.`,
  },
  {
    id: 'registration',
    icon: UserPlus,
    title: '5. ACCOUNT REGISTRATION',
    body: `You must register an account to use most Platform features. When registering, you agree to:\n(a) provide accurate, current, and complete information;\n(b) maintain and promptly update your information;\n(c) maintain the security of your credentials;\n(d) notify A-List immediately of any unauthorized use of your account; and\n(e) accept responsibility for all activities under your account.\n\nYou may not create more than one account per person or legal entity, share your account with any other person, or use automated means to create accounts.`,
  },
  {
    id: 'roles',
    icon: Briefcase,
    title: '6. USER ROLES & RESPONSIBILITIES',
    body: `6.1 A-List Clients (Homeowners). Clients shall: (a) post only legitimate Projects that the Client has authority and intent to fund; (b) fund approved Projects through the Project Funds Account; (c) release milestone payments only upon satisfactory completion of the corresponding milestone; (d) communicate with Service Providers in good faith; and (e) pay all applicable taxes, permits, and fees related to their Projects.\n\n6.2 A-List Home Pros. Home Pros shall: (a) represent qualifications, licenses, insurance, and experience honestly and completely; (b) maintain all required licenses, registrations, and insurance at all times (see Section 8); (c) perform services competently, lawfully, and as agreed; (d) comply with all applicable building codes, permit requirements, and workmanship standards; (e) honor all warranties, guarantees, and commitments made to Clients; and (f) comply with Section 8.\n\n6.3 A-List Crew Members. Crew Members shall: (a) provide skilled labor professionally; (b) fulfill agreed responsibilities on each Project; (c) work under the direction of the contracting Home Pro or Client; (d) comply with all applicable worker-safety rules; and (e) maintain any required licenses or certifications.\n\n6.4 A-List Specialists. Specialists shall: (a) coordinate Projects transparently; (b) act in the best interests of involved parties; (c) disclose any material conflicts of interest; and (d) not hold out to the public as licensed contractors unless actually licensed.\n\n6.5 A-List Affiliates. A-List Affiliates shall: (a) refer only genuine users who have a bona fide interest in the Platform; (b) comply with all requirements of the A-List Affiliate Program (Section 16); (c) comply with the FTC's Endorsement Guides when making public endorsements; and (d) not misrepresent the Platform or earnings potential in any way.`,
  },
  {
    id: 'independent',
    icon: LinkIcon,
    title: '7. INDEPENDENT RELATIONSHIPS',
    body: `All Users operate as independent entities. Nothing in these Terms creates any employment, agency, partnership, joint venture, franchise, or other relationship between A-List and any User, except that each Service Provider appoints A-List as its limited agent solely for the purpose of receiving payments from Clients, as set forth in Section 12.\n\nA-List does not control, supervise, direct, or manage the work performed by any Service Provider. Service Providers are solely responsible for the manner, means, methods, and results of their work, for compliance with all applicable laws, and for all taxes, insurance, and benefits associated with themselves and any persons they engage.`,
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    title: '8. SERVICE PROVIDER LICENSING, INSURANCE & LEGAL COMPLIANCE COVENANTS',
    body: `Each Service Provider represents, warrants, and covenants on an ongoing basis that:\n(a) Licensing. Service Provider holds every license required by the state, county, and municipality, including (for Florida Projects) any license required under Fla. Stat. Ch. 489 or Ch. 455. Service Provider shall not bid on, accept, or perform work that exceeds the scope of its license.\n(b) Insurance. Service Provider maintains at all times (i) commercial general liability insurance of not less than $1,000,000 per occurrence and $2,000,000 aggregate, (ii) workers' compensation, and (iii) specialty insurance. Service Provider shall provide proof of coverage upon request.\n(c) Florida deposit and performance rules. Service Provider shall comply with Fla. Stat. § 489.126.\n(d) Construction lien law. Service Provider shall comply with Fla. Stat. Ch. 713.\n(e) Recovery Fund disclosure. Compliance with Fla. Stat. § 489.1425 for projects exceeding $2,500.\n(f) Ongoing disclosure. Service Provider shall notify A-List of any changes in license, insurance, or legal status within 5 business days.\n(g) Indemnity. Service Provider shall indemnify A-List from any claim arising from a breach of this Section 8.`,
  },
  {
    id: 'recovery-fund',
    icon: Info,
    title: '9. FLORIDA HOMEOWNERS\' CONSTRUCTION RECOVERY FUND NOTICE',
    body: `For any residential construction, repair, or improvement Project located in Florida with a total value exceeding $2,500, the following notice applies:\n\nFLORIDA HOMEOWNERS' CONSTRUCTION RECOVERY FUND\nPAYMENT, UP TO A LIMITED AMOUNT, MAY BE AVAILABLE FROM THE FLORIDA HOMEOWNERS' CONSTRUCTION RECOVERY FUND IF YOU LOSE MONEY ON A PROJECT PERFORMED UNDER CONTRACT, WHERE THE LOSS RESULTS FROM SPECIFIED VIOLATIONS OF FLORIDA LAW BY A LICENSED CONTRACTOR. FOR INFORMATION CONTACT THE FLORIDA CONSTRUCTION INDUSTRY LICENSING BOARD AT: (850) 487-1395.`,
  },
  {
    id: 'cancel',
    icon: XCircle,
    title: '10. RIGHT TO CANCEL (FLORIDA HOME SOLICITATION SALES)',
    body: `For Projects subject to the Florida Home Solicitation Sales Act (Fla. Stat. Ch. 501, Part II):\n\nNOTICE OF CANCELLATION RIGHT\nYOU, THE BUYER, MAY CANCEL THIS TRANSACTION AT ANY TIME PRIOR TO MIDNIGHT OF THE THIRD BUSINESS DAY AFTER THE DATE OF THIS TRANSACTION. TO CANCEL, SEND A WRITTEN NOTICE TO THE SERVICE PROVIDER OR CANCEL THROUGH THE PLATFORM'S IN-APP CANCELLATION TOOL.`,
  },
  {
    id: 'funds-processing',
    icon: CreditCard,
    title: '11. PROJECT FUNDS ACCOUNT & PAYMENT PROCESSING',
    body: `11.1 Purpose. The Project Funds Account is a payment-management feature of the Platform that holds Client payments until Client-approved milestones are completed and releases the appropriate payment to the applicable Service Provider.\n11.2 Payment processor. Payments are processed by Stripe, Inc. or another licensed Payment Processor.\n11.3 Payment methods. ACH, debit card, and credit card. No financing is currently brokered.\n11.4 Milestone release. Funds are released upon Client's approval or per Section 21.\n11.6 Fees. A-List may charge payment-processing or Platform fees.\n11.7 Tax reporting. Users are responsible for all taxes. 1099 forms will be issued where required.\n11.8 Quotes and proposals are not contractual offers. Any communication before funding is for informational purposes only.`,
    warning: `11.5 Not escrow; not a bank. THE PROJECT FUNDS ACCOUNT IS NOT AN ESCROW ACCOUNT, TRUST ACCOUNT, OR BANK ACCOUNT. A-LIST IS NOT A LICENSED ESCROW AGENT, TRUST COMPANY, OR BANK. FUNDS HELD PENDING MILESTONE RELEASE ARE NOT INSURED BY THE FDIC AND DO NOT EARN INTEREST FOR THE USER.`,
  },
  {
    id: 'agent-payee',
    icon: Handshake,
    title: '12. AGENT-OF-PAYEE DESIGNATION',
    body: `Each Service Provider hereby appoints A-List as its limited agent for the sole and specific purpose of receiving, holding, and distributing funds from Clients. A Client's payment to A-List via the Project Funds Account shall be considered the same as payment made directly to the Service Provider.\n\nThis Section is intended to qualify the arrangement as an "agent of the payee" arrangement exempt from money-transmitter licensing under the laws of each U.S. state that recognizes such an exemption.`,
  },
  {
    id: 'non-circumvention',
    icon: Ban,
    title: '13. NON-CIRCUMVENTION',
    body: `Users agree not to bypass the Platform to conduct transactions with users initially introduced through A-List. During the term and for 24 months thereafter, no User shall solicit or engage outside of the Platform. Violations result in immediate termination and liquidated damages equal to 20% of the circumvented contract value, or $2,500, whichever is greater.`,
  },
  {
    id: 'conduct',
    icon: Scale,
    title: '14. CODE OF CONDUCT',
    body: `Users shall NOT: (a) misrepresent identity or licensing; (b) circumvent payment systems; (c) engage in harassment or discrimination; (d) post fake projects or reviews; (e) solicit off-platform; (f) hack or interfere with the Platform; (g) use for unlawful purposes; (h) scrape data; or (i) infringe IP. Violations result in immediate suspension and forfeiture of funds.`,
  },
  {
    id: 'memberships',
    icon: RefreshCw,
    title: '15. MEMBERSHIPS & SUBSCRIPTIONS',
    body: `15.1 Paid plans. Home Pro ($200/mo) and Crew Member ($50/mo). Pricing at alisthomepros.com/pricing.\n15.2 Automatic renewal. YOUR SUBSCRIPTION AUTOMATICALLY RENEWS EACH BILLING CYCLE UNTIL YOU CANCEL.\n15.3 How to cancel. Via account settings or email to support@alisthomepros.com.\n15.4-15.6 Specific disclosures for California and other state subscribers regarding renewal and price changes.\n15.7 Refunds. Except as required by law, A-List does not provide prorated refunds.`,
  },
  {
    id: 'affiliate-program',
    icon: Gift,
    title: '16. A-LIST AFFILIATE PROGRAM',
    body: `16.1 Structure. Single-level only. No multi-level marketing or pyramid structure.\n16.2 Commission. 10% recurring monthly on net Subscription revenue from Referred Users.\n16.3 No pay-to-play. Participation is open to all Users in good standing.\n16.6 FTC Endorsement Guides. MUST conspicuously disclose material connection (e.g., "#ad", "Paid partner").\n16.7 Earnings disclosure. Most participants earn little or no income. Past performance doesn't guarantee results.\n16.9 Payment. Monthly in arrears, subject to a $25.00 minimum payout.`,
  },
  {
    id: 'background',
    icon: Search,
    title: '17. BACKGROUND CHECKS (FCRA)',
    body: `A-List may obtain a "consumer report" as defined in the Fair Credit Reporting Act (FCRA). Reports may include criminal history and professional licenses. Service Providers authorize such reports for platform-eligibility purposes. A-List follows FCRA procedures for any adverse actions.`,
  },
  {
    id: 'ip',
    icon: Lock,
    title: '18. INTELLECTUAL PROPERTY',
    body: `18.1 A-List IP. All Platform elements are the exclusive property of A-List.\n18.2 User content. Users retain ownership but grant A-List a license to host and promote content for operating the Platform.\n18.3 Feedback. Irrevocable license to A-List for any purpose.\n18.4 DMCA. Compliance with Digital Millennium Copyright Act. Notices to dmca@alisthomepros.com.`,
  },
  {
    id: 'privacy',
    icon: Eye,
    title: '19. PRIVACY & DATA RIGHTS',
    body: `Governed by our Privacy Policy. Residents of multiple U.S. states have additional rights (access, correction, deletion, portability, etc.) as described in the Privacy Policy.`,
  },
  {
    id: 'third-party-pii',
    icon: Shield,
    title: '20. USER-UPLOADED PERSONAL INFORMATION ABOUT THIRD PARTIES',
    body: `Users are solely responsible for any personal information about third parties (employees, subcontractors, etc.) they upload. You must provide required notices and obtain necessary consents. A-List does not screen or monitor this information and provides it on an "AS IS" basis. You agree to indemnify A-List for any claims related to Third-Party PII you upload.`,
  },
  {
    id: 'user-disputes',
    icon: MessageSquare,
    title: '21. DISPUTE RESOLUTION BETWEEN USERS (PLATFORM-ASSISTED)',
    body: `21.1 Internal mediation. A-List may assist in mediation of disputes.\n21.2 Fund holds. Funds may be held for up to 30 days during mediation review.\n21.3 No guarantee. A-List does not guarantee specific outcomes.\n21.4 Binding resolution. Unresolved disputes subject to the arbitration agreement in Section 26.`,
  },
  {
    id: 'warranties',
    icon: AlertTriangle,
    title: '22. DISCLAIMER OF WARRANTIES',
    body: `THE PLATFORM IS PROVIDED "AS IS". A-LIST DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. A-List makes no warranty regarding Service Provider quality, safety, or project outcome.`,
  },
  {
    id: 'liability',
    icon: ShieldIcon,
    title: '23. LIMITATION OF LIABILITY',
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, A-LIST SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF $100 OR TOTAL FEES PAID IN THE LAST 12 MONTHS.`,
  },
  {
    id: 'indemnity',
    icon: Gavel,
    title: '24. INDEMNIFICATION',
    body: `24.1 User indemnity. You agree to defend and indemnify A-List from claims arising from breach of these Terms, violation of law, or services provided/received.\n24.4 Release of unknown claims. Waiver of California Civil Code § 1542.`,
  },
  {
    id: 'termination',
    icon: LogOut,
    title: '25. ACCOUNT TERMINATION',
    body: `A-List may terminate for violations or harmful conduct. You may terminate via settings. Sections that should survive termination will survive. Appeals can be sent to appeals@alisthomepros.com within 30 days.`,
  },
  {
    id: 'arbitration',
    icon: Hammer,
    title: '26. ARBITRATION & CLASS ACTION WAIVER',
    body: `BINDING INDIVIDUAL ARBITRATION administered by the AAA in Miami-Dade County, Florida. Mandatory informal dispute resolution process applies first. 30-day opt-out available at arbitration-optout@alisthomepros.com. CLASS ACTION WAIVER: Claims may only be brought in an individual capacity.`,
  },
  {
    id: 'law',
    icon: MapPin,
    title: '27. GOVERNING LAW',
    body: `Governed by the laws of the State of Florida. Exclusive venue in Miami-Dade County, Florida.`,
  },
  {
    id: 'electronic',
    icon: PenTool,
    title: '28. ELECTRONIC SIGNATURES & COMMUNICATIONS',
    body: `Consent to conduct transactions and receive all records, notices, and tax forms (1099-K, 1099-NEC) electronically. Satisfies the federal ESIGN Act and state equivalents.`,
  },
  {
    id: 'changes',
    icon: Edit3,
    title: '29. CHANGES TO TERMS',
    body: `A-List may modify Terms with 30 days' advance notice for material changes. Continued use constitutes acceptance of revised Terms.`,
  },
  {
    id: 'protective',
    icon: ShieldCheck,
    title: '30. ADDITIONAL PROTECTIVE PROVISIONS',
    body: `30.1 Authorized Users. 30.2 Competitor Access Excluded. 30.3 Tracking Communications. 30.4 Telephone/SMS Consent (TCPA). 30.6 AI and Automated Tools. 30.7 Liquidated Damages for Specific Violations. 30.11 Statement on Verification.`,
  },
  {
    id: 'misc',
    icon: MoreHorizontal,
    title: '31. MISCELLANEOUS',
    body: `31.1 Entire Agreement. 31.2 Severability. 31.3 No waiver. 31.5 Force majeure. 31.6 Legal notices. 31.9 Export compliance. 31.11 Third-party beneficiaries.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: '32. CONTACT',
    body: `Questions about these Terms:\nEmail: legal@alisthomepros.com\nMail: A-List Home Professionals, LLC, 5133 Pine Grove Drive, West Palm Beach, Florida 33417`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900 pb-24">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 pt-10 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight uppercase italic pr-12 overflow-visible">
             Terms of <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Service</span>
           </h1>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/60 font-bold uppercase tracking-widest text-[10px]">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                 <ShieldCheck className="w-4 h-4 text-primary-400" />
                 Effective: April 10, 2026
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                 <RefreshCw className="w-4 h-4 text-primary-400" />
                 Updated: April 10, 2026
              </div>
           </div>
        </div>
      </section>

      {/* Important Alert */}
      <section className="px-4 -mt-12 relative z-20">
         <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-10 items-center text-center md:text-left">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg shadow-red-500/5">
               <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-gray-950 mb-4 tracking-tight uppercase italic pr-4">IMPORTANT — PLEASE READ CAREFULLY</h2>
               <p className="text-gray-500 font-medium leading-relaxed italic pr-4">
                 THESE TERMS CONTAIN A BINDING ARBITRATION PROVISION AND A CLASS ACTION WAIVER IN SECTION 26 THAT AFFECT YOUR LEGAL RIGHTS.
               </p>
            </div>
         </div>
      </section>

      {/* Table of Contents */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="group p-6 bg-white border border-gray-100 rounded-3xl hover:border-primary-200 hover:shadow-xl transition-all"
                >
                   <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                      <section.icon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                   </div>
                   <p className="text-[10px] font-black text-gray-950 uppercase tracking-tight leading-tight italic line-clamp-2">
                      {section.title}
                   </p>
                </a>
             ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto space-y-24">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id} className="scroll-mt-32">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                   <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                      <Icon className="w-8 h-8 text-primary-400" />
                   </div>
                   <div className="space-y-6 flex-1">
                      <h2 className="text-3xl font-black text-gray-950 uppercase tracking-tighter italic pr-12 overflow-visible">
                         {section.title}
                      </h2>
                      <div className="space-y-6">
                        {section.body.split('\n\n').map((para, i) => (
                          <p key={i} className="text-lg text-gray-500 font-medium leading-relaxed italic pr-4 whitespace-pre-wrap">
                            {para}
                          </p>
                        ))}
                      </div>

                      {section.warning && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-8 rounded-r-[2rem] mt-8">
                           <div className="flex items-start gap-4">
                              <Info className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                              <p className="text-amber-900 font-black italic uppercase text-sm leading-relaxed pr-4">
                                {section.warning}
                              </p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Acknowledgment */}
      <section className="px-4 py-32">
         <div className="max-w-5xl mx-auto bg-gray-950 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic pr-12 overflow-visible">
                 Ready to <span className="text-primary-400 pr-10">Proceed?</span>
               </h2>
               <p className="text-xl text-white/60 font-medium italic mb-12 max-w-2xl mx-auto">
                 By using the Platform, you acknowledge that you have read and agree to be bound by these Terms.
               </p>
               <div className="flex flex-col items-center gap-6">
                 <Link 
                   href={APP_GATEWAY_URL}
                   className="inline-flex items-center gap-4 bg-primary-600 text-white px-12 py-6 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-2xl shadow-primary-500/20 group"
                 >
                    Accept & Enter
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                 </Link>
               </div>
               <p className="mt-12 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] italic">
                 © 2026 A-List Home Professionals, LLC. All rights reserved.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}