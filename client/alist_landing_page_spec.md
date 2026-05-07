# A-List Home Pros — Project Intake Landing Page Spec

**For:** Web developer
**From:** Jeffrey D. West Jr.
**Goal:** Build a dedicated, promotable landing page that captures homeowner/property owner project requests for any type of construction work in South Florida. Founder (Jeffrey) personally matches each submission within 24–72 hours.

This page replaces the homeowner content on the main site (sections 1.6 and 1.7 of the developer brief) and is built to be promoted on social media, paid ads, and organic search.

---

## SECTION A — URL & Page Setup

### A.1 Recommended URL slug
Pick one based on what you'll promote:

| Option | Best for |
|---|---|
| `/start-your-project` | Direct, action-oriented — best for paid ads |
| `/get-matched` | Brand-aligned with "founder personally matches you" |
| `/find-a-contractor` | Best for SEO (matches search intent) |
| `/south-florida-contractor` | Best for local SEO |

**Recommendation:** Use `/start-your-project` as the canonical URL, then set up redirects from `/get-matched`, `/find-a-contractor`, and `/match-me` so all roads lead to the same page.

### A.2 Page meta tags (for SEO)
```html
<title>South Florida Contractor Matching | A-List Home Pros</title>
<meta name="description" content="Skip the lead-gen middleman. Submit your South Florida construction project and get personally matched with a vetted A-List Founding Pro within 24–72 hours. No bidding wars, no shared leads.">
<meta name="keywords" content="south florida contractor, palm beach contractor, broward contractor, miami-dade contractor, home renovation south florida, kitchen remodel contractor, bathroom remodel contractor, roofing contractor south florida">
<link rel="canonical" href="https://www.alisthomepros.com/start-your-project">

<!-- Open Graph for social sharing -->
<meta property="og:title" content="South Florida Contractor Matching | A-List Home Pros">
<meta property="og:description" content="Get personally matched with a vetted contractor by our founder — within 24–72 hours. South Florida only.">
<meta property="og:image" content="[hero image URL]">
<meta property="og:url" content="https://www.alisthomepros.com/start-your-project">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="South Florida Contractor Matching | A-List Home Pros">
<meta name="twitter:description" content="Get personally matched with a vetted contractor by our founder — within 24–72 hours. South Florida only.">
```

### A.3 Schema markup (critical for AEO — Answer Engine Optimization)
This helps the page show up in ChatGPT, Perplexity, Google AI Overviews, and rich snippets. Add this JSON-LD block in the page head:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "A-List Home Pros",
  "description": "South Florida contractor matching service. Founder personally matches homeowners and property owners with vetted, license-verified contractors.",
  "url": "https://www.alisthomepros.com/start-your-project",
  "telephone": "+1-561-888-4930",
  "email": "jwest@alisthp.com",
  "areaServed": [
    {"@type": "AdministrativeArea", "name": "Palm Beach County, Florida"},
    {"@type": "AdministrativeArea", "name": "Broward County, Florida"},
    {"@type": "AdministrativeArea", "name": "Miami-Dade County, Florida"}
  ],
  "serviceType": [
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Home Renovation",
    "Roofing",
    "Interior Painting",
    "Exterior Painting",
    "Flooring Installation",
    "Electrical Services",
    "Plumbing Services",
    "HVAC Services",
    "Landscaping",
    "Pool Construction"
  ],
  "founder": {
    "@type": "Person",
    "name": "Jeffrey D. West Jr.",
    "jobTitle": "Founder"
  }
}
</script>
```

Add a second JSON-LD block for the FAQ section (see Section H):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How fast will I be matched with a contractor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our founder Jeffrey D. West Jr. personally reviews every project and matches you with a vetted A-List Founding Pro within 24 to 72 hours."
      }
    },
    {
      "@type": "Question",
      "name": "Where does A-List Home Pros operate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A-List Home Pros currently serves Palm Beach County, Broward County, and Miami-Dade County in South Florida."
      }
    },
    {
      "@type": "Question",
      "name": "Will my information be sold to multiple contractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Unlike traditional lead-generation platforms, A-List Home Pros does not sell or share your project with multiple competing contractors. Your project is matched with one vetted A-List Founding Pro at a time."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a fee to submit a project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Submitting a project through A-List Home Pros is free for homeowners and property owners. Pricing is determined directly between you and your matched contractor."
      }
    }
  ]
}
</script>
```

---

## SECTION B — Page Structure (Top to Bottom)

The page is a single scrolling layout. Each section below maps to a content block. Build mobile-first.

```
┌──────────────────────────────────┐
│ B.1 — Sticky top bar with logo + │
│       phone + "Submit Project" CTA│
├──────────────────────────────────┤
│ B.2 — Hero with primary form     │
├──────────────────────────────────┤
│ B.3 — Trust strip (4 icons)      │
├──────────────────────────────────┤
│ B.4 — How It Works (3 steps)     │
├──────────────────────────────────┤
│ B.5 — Service categories grid    │
├──────────────────────────────────┤
│ B.6 — A-List vs. legacy platforms│
├──────────────────────────────────┤
│ B.7 — Founder block              │
├──────────────────────────────────┤
│ B.8 — Service area               │
├──────────────────────────────────┤
│ B.9 — Secondary form (full)      │
├──────────────────────────────────┤
│ B.10 — FAQ (AEO critical)        │
├──────────────────────────────────┤
│ B.11 — Final CTA                 │
├──────────────────────────────────┤
│ B.12 — Footer with disclaimers   │
└──────────────────────────────────┘
```

---

## SECTION C — Block-by-Block Content

### C.1 — Sticky top bar
- Left: A-List Home Pros logo (links to `/`)
- Right (desktop): Phone number "(561) 888-4930" + button "Submit Project" (anchors to form)
- Right (mobile): Phone icon + button "Submit Project"
- Background: Dark navy (#0B1A30 or your brand value)
- Always visible on scroll

### C.2 — Hero section (above the fold)

**Layout:** Two-column on desktop (copy left, form right). Stacked on mobile (copy on top, form below).

**Left column copy:**

> **H1:** Have a Project on Your Property in South Florida?
>
> **Subhead:** Whether you're a homeowner, property manager, investor, or business owner — submit your project and our founder will personally match you with a vetted A-List Founding Pro within 24–72 hours.
>
> **Bullet list (with checkmark icons):**
> ✓ No bidding wars. Your project goes to one matched pro, not five.
> ✓ License-verified contractors only.
> ✓ Direct line to the founder — every match is personal.
> ✓ Free for homeowners. No fees, no obligations.

**Right column — primary form (short version):**

> **Form heading:** Get Matched in 24–72 Hours
>
> **Fields:**
> - First Name (required)
> - Email (required)
> - Phone (required)
> - ZIP code (required)
> - Project Type (required dropdown — see C.5 list)
>
> **Submit button:** "Get Matched →"
>
> **Microcopy below button:** *Free. No spam. One personal match — not five competing bids.*
>
> **🚨 Consent block above submit:**
> *By submitting, I agree A-List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with my matched A-List Founding Pro. Message and data rates may apply. Reply STOP to unsubscribe. See [Privacy Policy](/privacy) and [Terms](/terms).*

### C.3 — Trust strip

Horizontal row of 4 icons + short labels (use simple icons, not stock photos):

| Icon | Label | Sublabel |
|---|---|---|
| 👤 (founder icon) | Founder Personally Matches You | No auto-routing |
| ✓ (shield) | License-Verified Pros | Florida DBPR confirmed |
| 🔒 (lock) | Your Info Stays Private | Never sold to multiple bidders |
| ⏱ (clock) | 24–72 Hour Response | Direct from the founder |

### C.4 — How It Works (3 steps)

**Heading:** How A-List Matches You

**3 columns / cards:**

**01 — Submit Your Project**
Tell us what you need done — kitchen remodel, roofing, plumbing, full renovation, anything. Takes about 2 minutes.

**02 — Founder Reviews & Matches**
Jeffrey personally reviews every submission and matches you with the right vetted contractor for your project, location, and budget. Within 24–72 hours.

**03 — Connect Directly**
You and your matched pro talk directly. No middleman, no lead resold to five competitors. Pricing is between you and the contractor.

### C.5 — Service categories grid

**Heading:** Every Type of Project, Every Type of Property

**Subhead:** From single-room renovations to full property builds — across South Florida.

**Grid of cards (3-column desktop, 2-column tablet, 1-column mobile). Each card has an icon + label. These also serve as SEO keyword anchors:**

- 🍳 Kitchen Remodeling
- 🛁 Bathroom Remodeling
- 🏠 Full Home Renovation
- 🪜 Roofing & Roof Repair
- 🎨 Interior Painting
- 🏡 Exterior Painting
- 🪵 Flooring Installation
- ⚡ Electrical Services
- 🚿 Plumbing Services
- ❄️ HVAC Installation & Repair
- 🌴 Landscaping & Hardscape
- 🏊 Pool Construction & Repair
- 🪟 Windows & Doors
- 🚪 Garage & Driveways
- 🧱 Tile, Stone & Masonry
- 📋 Project Management

**Note for developer:** Each card should be a `<div>` with a unique `id` (e.g., `id="service-kitchen-remodeling"`) so paid ads and SEO links can deep-link to specific service categories.

### C.6 — Comparison block (A-List vs. legacy platforms)

**Heading:** Why Property Owners Choose A-List

**Two-column comparison table:**

| Traditional Lead-Gen Platforms | A-List Home Pros |
|---|---|
| ❌ Your info sold to 4–6 competing contractors | ✅ One personal match, made by the founder |
| ❌ Bombarded by phone calls and emails | ✅ One contractor reaches out, that's it |
| ❌ "Verified" pros with no real verification | ✅ Florida DBPR license-verified |
| ❌ Pay for leads that never convert | ✅ Free for homeowners, always |
| ❌ No accountability when things go wrong | ✅ Direct line to the founder, every project |

### C.7 — Founder block

**Heading:** Built by a South Florida Contractor

**Layout:** Photo of Jeffrey on left (placeholder until provided), copy on right.

**Copy:**
> Jeffrey D. West Jr. spent years in South Florida construction watching skilled contractors lose to lead-gen platforms that sold their leads to five competitors at once.
>
> A-List is the alternative — built so good contractors get matched with serious projects, and serious property owners get matched with one verified pro instead of five competing pitches.
>
> *"Every project that comes in, I see it. I match it. That's not changing anytime soon."* — Jeffrey D. West Jr., Founder
>
> 📞 (561) 888-4930
> ✉️ jwest@alisthp.com

### C.8 — Service area

**Heading:** Currently Serving South Florida

**Subhead:** A-List Home Pros matches projects across the South Florida tri-county area.

**3-column list (or pill tags) of cities — these are gold for local SEO:**

**Palm Beach County**
West Palm Beach · Boca Raton · Boynton Beach · Delray Beach · Jupiter · Wellington · Royal Palm Beach · Lake Worth · Greenacres · Palm Beach Gardens · North Palm Beach

**Broward County**
Fort Lauderdale · Pompano Beach · Coral Springs · Plantation · Sunrise · Davie · Hollywood · Pembroke Pines · Miramar · Weston · Deerfield Beach

**Miami-Dade County**
Miami · Miami Beach · Coral Gables · Aventura · Doral · Homestead · Kendall · Hialeah · North Miami · Pinecrest

**Below the list:** *Don't see your city? Submit your project — if you're in South Florida, we likely cover it.*

### C.9 — Secondary form (full version)

**This is the in-depth version of the form. Place after the service area block so users who scroll all the way down get a second conversion shot.**

**Heading:** Tell Us About Your Project

**Subhead:** The more we know, the better we match. All fields help us pair you with the right A-List Founding Pro.

**Fields:**
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (required)
- Property ZIP code (required)
- Project Type (required dropdown — full list from C.5)
- Budget Range (required dropdown):
  - Under $5,000
  - $5,000 – $25,000
  - $25,000 – $100,000
  - $100,000+
  - Not sure yet
- Timeline (required dropdown):
  - Urgent — within 2 weeks
  - 1–3 months
  - 3–6 months
  - Flexible / planning ahead
- Project Description (required textarea, 50-character minimum to filter spam)
- How did you hear about us? (optional dropdown — Google / Facebook / Instagram / Referral / TikTok / Other) **— this is for your attribution tracking, critical for ad ROI**

**Submit button:** "Submit Project"

**Trust copy below button:** *Jeffrey D. West Jr. personally reviews every project. You'll hear back within 24–72 hours with your matched pro.*

**🚨 Required consent block — directly above the submit button:**

> *By submitting, I agree A-List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with the matched A-List Founding Pro. Message and data rates may apply. Reply STOP to unsubscribe. See [Privacy Policy](/privacy) and [Terms](/terms).*

Plus a separate **unchecked** checkbox:
> ☐ *I'd like to receive marketing communications and project updates from A-List Home Pros.*

**Post-submit confirmation message (display in-place, replacing the form):**
> ✓ **Thanks — your project is in.**
>
> Jeffrey will personally review and reach out within 24–72 hours with your matched pro. Keep an eye on your inbox and phone — and check your spam folder just in case.
>
> Need to reach us right away? Call (561) 888-4930.

### C.10 — FAQ section (AEO-CRITICAL)

**Heading:** Frequently Asked Questions

**Subhead:** Everything you need to know before submitting your project.

**Use accordion/expandable Q&A format. Each Q&A should be wrapped in proper HTML for the FAQ schema (see A.3).**

**Q: How fast will I be matched with a contractor?**
A: Jeffrey, our founder, personally reviews every project submission. You'll be matched with a vetted A-List Founding Pro within 24–72 hours.

**Q: Will my information be sold to multiple contractors?**
A: No. Unlike traditional lead-gen platforms like Angi or HomeAdvisor, your project goes to one matched contractor — not five. We never sell or resell your information.

**Q: Is there a fee to submit a project?**
A: Submitting a project is free for homeowners and property owners. There are no fees, no obligations, and no commitments. Pricing for the actual work is negotiated directly between you and your matched contractor.

**Q: What kinds of projects can I submit?**
A: Any construction or home services project — kitchen and bathroom remodels, roofing, painting, flooring, electrical, plumbing, HVAC, landscaping, pool construction, full renovations, and more. If it's residential or light commercial in South Florida, we likely have a pro for it.

**Q: Where does A-List Home Pros currently operate?**
A: We currently serve Palm Beach County, Broward County, and Miami-Dade County in South Florida. If your project is outside this area, submit it anyway — we may be able to refer you.

**Q: Are A-List contractors licensed and insured?**
A: Every A-List Founding Pro has their Florida contractor or trade license verified through the Florida Department of Business and Professional Regulation (DBPR), and provides a current general liability insurance certificate before joining the network.

**Q: Who is Jeffrey D. West Jr.?**
A: Jeffrey is the founder of A-List Home Pros. He's a longtime South Florida construction professional who built A-List as the alternative to lead-gen platforms that sell leads to multiple competing contractors. Jeffrey personally reviews every project that comes through this page.

**Q: What if I'm not happy with my match?**
A: Reach out directly to (561) 888-4930 or jwest@alisthp.com. Jeffrey will personally re-match you with a different A-List Founding Pro at no additional cost.

**Q: Does A-List Home Pros guarantee the work?**
A: A-List Home Pros is a matching platform — we connect property owners with license-verified contractors but do not perform the work ourselves or guarantee outcomes. All work is between you and your matched contractor under a direct agreement.

**Q: Can property managers and businesses submit projects too?**
A: Yes. The form welcomes homeowners, property managers, real estate investors, landlords, and business owners. Just submit your project and Jeffrey will match it appropriately.

### C.11 — Final CTA

**Layout:** Full-width band with strong background color (dark navy with gold accent).

**Heading:** Ready to Stop Chasing Quotes?

**Subhead:** One project. One vetted match. One personal touch from the founder.

**CTA button:** "Submit Your Project →" (anchors to top hero form)

**Below button (small):** *Free. No spam. South Florida only.*

### C.12 — Footer

**Use the global footer from the main site (per developer brief Section 0.3) including:**

- A-List Home Pros logo and tagline
- Navigation: Home / About / How It Works / Pricing / Investors / Contact
- Contact: (561) 888-4930 · jwest@alisthp.com
- **🚨 Required disclaimer block:**

> *A-List Home Pros is a networking and matching platform. We do not perform contracting work, hold member or client funds, or guarantee the work, conduct, or outcomes of any matched contractor. License verification reflects status reported by the Florida DBPR as of the verification date and may change. All contractors are independent businesses, not employees or agents of A-List Home Pros. Nothing on this website constitutes legal, financial, or tax advice.*

- Legal: Terms / Privacy / Safety / Community
- Copyright: © 2026 A-List Home Professionals

---

## SECTION D — Form Backend Requirements

### D.1 Submission destination
Form submissions should hit your HubSpot Starter (or whatever CRM you're using) AND trigger:

1. **Email to Jeffrey** (jwest@alisthp.com) — full submission details
2. **SMS to Jeffrey** (561-888-4930) — short alert: "New project: [name] · [city] · [project type] · [budget]"
3. **Auto-reply email to submitter** — confirmation with expected timing
4. **Lead added to HubSpot** — with source attribution from the "How did you hear about us?" field

### D.2 Anti-spam measures
- reCAPTCHA v3 (invisible) on submit
- 50-character minimum on the project description field
- Honeypot field (hidden from users, bots fill it in and get rejected)
- Rate limit by IP (max 3 submissions per IP per hour)

### D.3 Tracking pixels for paid ad attribution
Place these in the page head:
- Meta (Facebook/Instagram) Pixel
- TikTok Pixel
- Google Tag (GA4 + Google Ads conversion tag)
- LinkedIn Insight Tag (for B2B property manager audiences)

Fire a "Submit Project" conversion event when the form is successfully submitted.

---

## SECTION E — Mobile-First Design Requirements

The majority of this traffic will come from social media on mobile.

- Hero form must be visible above the fold on a 375px-wide screen without scrolling
- All form fields must use native mobile inputs (`type="tel"`, `type="email"`, `inputmode="numeric"` for ZIP, etc.)
- Submit buttons minimum 48px tall, full-width on mobile
- Tap targets minimum 44x44px
- Fast load — page weight under 1.5MB total
- Hero image lazy-loaded, all other images lazy-loaded below the fold

---

## SECTION F — A/B Testing Setup

Set up two variants from launch so you have data to optimize:

**Variant A:** Hero headline = "Have a Project on Your Property in South Florida?"
**Variant B:** Hero headline = "Skip the Five Competing Bids. Get One Personal Match."

Run for 2 weeks minimum, ~500 visitors per variant, measure form submission rate.

---

## SECTION G — Promotion Copy (For Your Marketing Use)

Once the page is live, use this copy across channels:

### G.1 Facebook / Instagram ad copy

**Headline (40 char):** Skip the Lead-Gen Middleman.

**Primary text (125 char):** Submit your South Florida construction project. Founder personally matches you with one vetted pro in 24–72 hrs.

**CTA button:** Get Quote (or "Learn More")

**Link:** alisthomepros.com/start-your-project

### G.2 Google Search ad copy

**Headline 1:** South Florida Contractor Match
**Headline 2:** Founder Personally Matches You
**Headline 3:** No Shared Leads · No Bidding Wars
**Description:** Skip Angi & HomeAdvisor. Submit your project, get matched with a vetted Florida-licensed pro in 24–72 hours. Free for homeowners.

### G.3 Organic social post (LinkedIn / Facebook)

> If you've ever submitted a project on Angi, HomeAdvisor, or Thumbtack, you know what happens next: your phone rings. And rings. And rings. From four or five contractors who all paid for your info.
>
> A-List Home Pros works differently. You submit your project, I personally review it, and I match you with one vetted South Florida contractor — within 24–72 hours.
>
> No bidding wars. No shared leads. No middleman.
>
> Currently matching projects in Palm Beach, Broward, and Miami-Dade counties.
>
> alisthomepros.com/start-your-project

### G.4 TikTok / Reels script (30 seconds)

**[Hook, 0-3s]:** "If you submitted your kitchen remodel on Angi yesterday, your phone is about to blow up."

**[Problem, 3-12s]:** "These platforms sell your info to four or five contractors. They all call. They all email. You become a sales lead, not a customer."

**[Solution, 12-22s]:** "I built A-List Home Pros so that doesn't happen. You submit your project, I personally match you with one vetted contractor. That's it."

**[CTA, 22-30s]:** "South Florida only. Free. Link in bio. Or search A-List Home Pros."

---

## SECTION H — Open Questions for Jeffrey

Before launch:

1. **Photo of Jeffrey** — needed for the founder block. Headshot, on-site, or both?
2. **Hero image / video** — what's the visual for the top of the page? Aerial South Florida? On-site project? Stock construction photo?
3. **Confirm service area** — is the city list in C.8 accurate? Any cities to add or remove?
4. **Budget tier "Under $5,000"** — keep or raise the floor (some pros may not want sub-$5k jobs)?
5. **HubSpot integration** — does your developer have access to your HubSpot account for the form connection?
6. **Phone number for SMS alerts** — confirm 561-888-4930 is the right number for new-project SMS notifications
7. **A/B variant headlines** — approve the two variants in Section F or supply alternatives
8. **Privacy & Terms pages** — confirmed reviewed by counsel? The consent block links to them.

---

**End of spec.** Once your developer builds this, you'll have a single page you can drive paid social, paid search, organic SEO, and AEO traffic to — and every submission lands directly with you for manual matching to your founding pros.
