# A-List Home Pros — Two Page Build Spec

**For:** Osama
**From:** Jeffrey D. West Jr.
**Pages to build:** `/founder` and `/verification`
**Delivery date:** May 2, 2026

This document contains complete copy and structure for two pages:

1. **The Founder's Message** (`/founder`) — uses content from the existing About page with light legal cleanup
2. **Verification Standards** (`/verification`) — built from scratch; this page legally backstops every "verified" and "A-List Certified" claim on the site

Both pages should use the existing global navigation and global footer (per the main developer brief). Both are mobile-first.

---

# PAGE 1 — `/founder` — The Founder's Message

## P1.A — URL & Meta Tags

**URL:** `https://www.alisthomepros.com/founder`

**Page title:** `The Founder's Message | A-List Home Pros`

**Meta description:** `Why Jeffrey D. West Jr. built A-List Home Pros — the alternative to lead-gen platforms that sell contractor leads to five competitors at once.`

**Open Graph tags:**
```html
<meta property="og:title" content="The Founder's Message | A-List Home Pros">
<meta property="og:description" content="Why Jeffrey D. West Jr. built A-List Home Pros — the alternative to lead-gen platforms.">
<meta property="og:image" content="[Jeffrey's headshot URL]">
<meta property="og:url" content="https://www.alisthomepros.com/founder">
<meta property="og:type" content="article">
```

## P1.B — Page Structure

```
┌─────────────────────────────────────┐
│ Global navigation                   │
├─────────────────────────────────────┤
│ B.1 — Hero with photo + name        │
├─────────────────────────────────────┤
│ B.2 — The Founder's Message         │
│       (long-form essay)             │
├─────────────────────────────────────┤
│ B.3 — Pull quote                    │
├─────────────────────────────────────┤
│ B.4 — What A-List Stands For        │
│       (4-tile grid)                 │
├─────────────────────────────────────┤
│ B.5 — Who This Is For               │
├─────────────────────────────────────┤
│ B.6 — Sign-off                      │
├─────────────────────────────────────┤
│ B.7 — CTAs (Apply / Submit Project) │
├─────────────────────────────────────┤
│ Global footer                       │
└─────────────────────────────────────┘
```

## P1.C — Block-by-Block Content

### B.1 — Hero

**Layout:** Two-column on desktop (photo left, text right). Stacked on mobile.

**Left:** Photo of Jeffrey D. West Jr. (placeholder until provided — recommend a clean, on-site or professional headshot, dark background to match brand).

**Right:**

> **Eyebrow:** A Message from the Founder
>
> **H1:** Jeffrey Donald West Jr.
>
> **Subhead:** Founder, A-List Home Pros

### B.2 — The Founder's Message (long-form)

> ## Why I Built This
>
> I didn't build this in a boardroom. I built it because I saw the system eat the people who build Florida.
>
> I've spent years in construction. I've been on the ground, watching how this industry actually moves. I saw new contractors with massive skill get ignored because they didn't have the ad budget to pay off the gatekeepers. I saw veterans — guys who've been doing high-end work in Florida for thirty years — burned out and disgusted because lead platforms were selling them the same recycled leads they just sold to five of their competitors.
>
> The trust was dead. Homeowners were gambling on whoever had the biggest marketing budget, not the best results. Contractors were losing jobs to guys who gamed the review systems. It was a structural failure, and it needed a structural solution.
>
> ## What Changed My Thinking
>
> I started studying the platforms that actually changed industries. Uber didn't just make taxis more convenient — they rebuilt the entire relationship between the rider, the driver, and the infrastructure connecting them. They created accountability, transparency, and a system where the quality of the experience was the product.
>
> That model stayed with me. I started asking: what would that look like for construction? What if the platform actually served the professional — not just processed them? What if "license-verified" actually meant something specific, documented, and current? What if homeowners could connect with someone who genuinely earned their standing?
>
> ## What A-List Is
>
> That's what A-List is. And you have to earn it.
>
> When you join A-List and go through the verification process — license confirmation, insurance verification, identity validation — you become an A-List Member. When you complete additional accountability steps and earn your badges, you become A-List Certified.
>
> A-List Members are in the family. They're inside the ecosystem. But they haven't yet completed everything required to carry the certified name. The badge isn't given — it's built. Through credentials. Through accountability. Through a process that proves you're not just in this industry — you're committed to doing it right.
>
> We don't certify everyone who applies. We're building a network of South Florida's serious professionals — general contractors, skilled tradespeople, project coordinators, handymen, and the income earners who keep this industry moving.

### B.3 — Pull quote

Display this as a large, visually distinct callout block (italic, gold accent border, larger font):

> *"Most contractors compete for jobs. A-List members get positioned for them."*
>
> — Jeffrey D. West Jr.

### B.4 — What A-List Stands For (4-tile grid)

**Section heading:** What A-List Stands For

**4 tiles in a grid (2x2 on desktop, stacked on mobile):**

| Tile | Heading | Body |
|---|---|---|
| 🚫 | No Bidding Wars | We don't sell your project to five competing contractors. One project, one match. |
| ✓ | License-Verified Only | Every member's Florida contractor or trade license is confirmed through the DBPR. [See our standards →](/verification) |
| 🔗 | Direct Access | Clean, direct connections between homeowners and pros. No middleman pushing for "lead conversions." |
| 📋 | Built-In Accountability | Every project, every interaction, every milestone — handled inside the A-List app. |

### B.5 — Who This Is For

**Heading:** Who This Is For

**Body:**

> A-List is for the serious homeowners, general contractors, skilled trades, project coordinators, and income earners who keep South Florida running.
>
> It's for contractors who are tired of paying for the same lead five other guys already bought.
>
> It's for homeowners who are tired of getting bombarded by calls from companies they never asked to hear from.
>
> It's for the trades who do the work right and want to be positioned alongside others who do the same.
>
> If you want a directory, go to the yellow pages. If you want an ecosystem where quality is the currency — you belong here.

### B.6 — Sign-off

Display as a stylized signature block:

> **— Jeffrey Donald West Jr.**
> Founder, A-List Home Pros
>
> Direct: (561) 888-4930
> Email: jwest@alisthp.com

### B.7 — Final CTAs

Two side-by-side buttons (stacked on mobile):

**For pros:** "Apply for Founding Membership" → links to `/apply` or app signup
**For homeowners:** "Submit Your Project" → links to `/start-your-project` (the new landing page)

---

# PAGE 2 — `/verification` — Verification Standards

This page is the legal backstop for every "verified" and "A-List Certified" claim on the site. It must be specific, defensible, and updated when standards change.

## P2.A — URL & Meta Tags

**URL:** `https://www.alisthomepros.com/verification`

**Page title:** `Verification Standards | A-List Home Pros`

**Meta description:** `How A-List Home Pros verifies every member: license confirmation through Florida DBPR, insurance verification, identity validation, and annual recertification.`

**Open Graph tags:**
```html
<meta property="og:title" content="Verification Standards | A-List Home Pros">
<meta property="og:description" content="How we verify every contractor and crew member on A-List Home Pros.">
<meta property="og:url" content="https://www.alisthomepros.com/verification">
<meta property="og:type" content="article">
```

**Schema markup (FAQ):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does 'license-verified' mean on A-List Home Pros?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "License-verified means a member's active Florida contractor or trade license has been confirmed through the Florida Department of Business and Professional Regulation (DBPR) public records as of the verification date."
      }
    },
    {
      "@type": "Question",
      "name": "How often is verification renewed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All A-List members are recertified annually. License status, insurance certificates, and contact information are reconfirmed every twelve months. License changes reported by the Florida DBPR may trigger re-verification at any time."
      }
    },
    {
      "@type": "Question",
      "name": "Does A-List Home Pros guarantee the work of its verified members?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. A-List Home Pros is a networking and matching platform. We verify license status, insurance, and identity at the time of certification, but we do not perform contracting work, supervise projects, or guarantee outcomes. All contractors on A-List are independent businesses, not employees or agents of A-List Home Pros."
      }
    }
  ]
}
</script>
```

## P2.B — Page Structure

```
┌─────────────────────────────────────┐
│ Global navigation                   │
├─────────────────────────────────────┤
│ B.1 — Hero                          │
├─────────────────────────────────────┤
│ B.2 — The 4-Step Verification       │
│       Process (overview)            │
├─────────────────────────────────────┤
│ B.3 — Step 1: License Verification  │
├─────────────────────────────────────┤
│ B.4 — Step 2: Insurance             │
│       Verification                  │
├─────────────────────────────────────┤
│ B.5 — Step 3: Identity Verification │
├─────────────────────────────────────┤
│ B.6 — Step 4: Annual Recertification│
├─────────────────────────────────────┤
│ B.7 — Membership Tiers              │
│       (Member / Certified /         │
│        Founding Member)             │
├─────────────────────────────────────┤
│ B.8 — What Can Revoke Your Status   │
├─────────────────────────────────────┤
│ B.9 — Limitations & Disclaimers     │
├─────────────────────────────────────┤
│ B.10 — Reporting Concerns           │
├─────────────────────────────────────┤
│ B.11 — FAQ                          │
├─────────────────────────────────────┤
│ Global footer                       │
└─────────────────────────────────────┘
```

## P2.C — Block-by-Block Content

### B.1 — Hero

> **Eyebrow:** Verification Standards
>
> **H1:** What "Verified" Actually Means.
>
> **Subhead:** Every contractor, trade, and crew member on A-List Home Pros completes a four-step verification process before they can carry the A-List badge. This is what we check, how we check it, and how often.
>
> **Last updated:** [DATE — update when policy changes]

### B.2 — The 4-Step Verification Process (overview)

**Heading:** The A-List Verification Process

**Subhead:** Four steps. Documented. Repeatable. Renewed annually.

**4 cards in a horizontal scroll on mobile / 4-column grid on desktop:**

| Step | Title | Summary |
|---|---|---|
| 01 | **License Verification** | We confirm every contractor and trade license through the Florida DBPR public records database. |
| 02 | **Insurance Verification** | We require a current general liability insurance certificate on file, with A-List Home Pros listed for notification of cancellation. |
| 03 | **Identity Verification** | We verify each member's identity through a third-party identity-verification provider. |
| 04 | **Annual Recertification** | License status, insurance certificates, and member information are reconfirmed every twelve months. |

### B.3 — Step 1: License Verification

**Heading:** Step 1 — License Verification

**Body:**

> Every A-List member who provides licensed services in Florida must hold an active license issued by the Florida Department of Business and Professional Regulation (DBPR) or the appropriate Florida licensing authority for their trade.
>
> **What we verify:**
> - Active license status as of the verification date
> - License type matches the services the member offers on A-List
> - License is in good standing (no active disciplinary actions, suspensions, or revocations reported by DBPR at the time of verification)
> - Member's legal business name on the license matches the name used on A-List
>
> **How we verify:**
> We confirm license information through the Florida DBPR public license search at [https://www.myfloridalicense.com](https://www.myfloridalicense.com). Verification dates are recorded in the member's internal A-List profile.
>
> **What this does not verify:**
> License verification confirms a member's legal authorization to perform licensed work in Florida as of the verification date. It is **not** a guarantee of competence, quality of work, or future conduct. License status can change at any time after verification, and members are required to notify A-List Home Pros of any change in license status.

### B.4 — Step 2: Insurance Verification

**Heading:** Step 2 — Insurance Verification

**Body:**

> Every A-List member who performs licensed contracting work in Florida must provide current proof of general liability insurance before becoming verified.
>
> **What we require:**
> - Current Certificate of Insurance (COI) from a licensed insurance carrier
> - General liability coverage of no less than $1,000,000 per occurrence (recommended; specific minimums may vary by trade)
> - Workers' compensation coverage where required by Florida law
> - Policy effective dates that cover the verification period
>
> **How we verify:**
> We require members to upload their current COI directly to their A-List profile. Where possible, we request that A-List Home Pros be listed as a certificate holder so we receive notification if coverage lapses.
>
> **What this does not verify:**
> Insurance verification confirms the existence of an active policy at the time of verification. It is **not** a guarantee that any specific claim will be covered, that coverage will remain active, or that the member maintains continuous coverage between verification dates. Homeowners are encouraged to request a current COI directly from any A-List member before signing a contract.

### B.5 — Step 3: Identity Verification

**Heading:** Step 3 — Identity Verification

**Body:**

> Every A-List member completes identity verification before becoming visible on the platform.
>
> **What we verify:**
> - Government-issued photo identification (driver's license, passport, or state ID)
> - Match between the legal name on identification and the name registered on A-List
> - Liveness check confirming the person submitting the identification matches the photo on the ID
>
> **How we verify:**
> Identity verification is conducted through a third-party identity-verification provider. Personal identification documents submitted during verification are handled in accordance with our [Privacy Policy](/privacy).
>
> **What this does not verify:**
> Identity verification confirms that the person registering the A-List account is who they claim to be. It is **not** a background check, criminal history check, or credit check. We do not currently include a criminal background check as part of standard verification, though this may be added for specific tiers in the future.

### B.6 — Step 4: Annual Recertification

**Heading:** Step 4 — Annual Recertification

**Body:**

> A-List verification is not a one-time event. Every member is recertified annually.
>
> **What we recheck every twelve months:**
> - License status and good standing
> - Current insurance coverage
> - Business and contact information
> - Any reported violations, complaints, or disciplinary actions
>
> **Continuous monitoring:**
> Where possible, we monitor license and insurance status continuously between annual recertification dates. Members are required to notify A-List Home Pros within seven days of any of the following:
> - License suspension, revocation, or expiration
> - Lapse in insurance coverage
> - Change in business ownership or legal name
> - Any disciplinary action by a Florida licensing authority
> - Any judgment or pending lawsuit related to contracting work
>
> Failure to disclose changes in any of these areas may result in immediate suspension of A-List status.

### B.7 — Membership Tiers

**Heading:** What the Badges Mean

**Subhead:** A-List status is built in stages. Every level represents a different point in the verification and accountability process.

**3 tier cards (vertical stack on mobile, 3-column on desktop):**

---

**🟢 A-List Member**

*Entry-level status.*

Members at this level have:
- Created an A-List profile
- Submitted basic business information
- Begun the verification process

Members are visible inside the network but **do not** carry the License-Verified or A-List Certified badge.

---

**🛡 License-Verified**

*Standard verified status.*

Members at this level have completed:
- License verification (Step 1)
- Insurance verification (Step 2)
- Identity verification (Step 3)

Members carry the **License-Verified badge** on their profile and can be matched to homeowner projects.

---

**⭐ A-List Certified Founding Member**

*Highest standard.*

Members at this level have:
- Completed all four verification steps
- Joined during the founding member period
- Locked in charter pricing for life
- Been personally vetted by the founder

Members carry both the **License-Verified** and **Founding Member** badges and receive priority placement in PULSE map results.

---

### B.8 — What Can Revoke Your Status

**Heading:** What Revokes A-List Status

**Body:**

> A-List verification is conditional. Status can be suspended or revoked at any time for any of the following:
>
> - License suspension, revocation, expiration, or any disciplinary action by a Florida licensing authority
> - Lapse in required insurance coverage
> - Failure to recertify within the required window
> - Substantiated complaints from homeowners regarding fraud, abandonment, or unsafe work
> - Misrepresentation of credentials, license type, or services offered
> - Soliciting payment outside of the A-List milestone payment workflow in violation of the [Terms of Service](/terms)
> - Sharing leads, projects, or member information with non-members in violation of platform rules
> - Any conduct that violates the [A-List Community Standards](/community)
>
> Status revocation may be temporary (suspension pending resolution) or permanent (removal from the network). Members removed from A-List are not eligible to rejoin under a different name or business entity.

### B.9 — Limitations & Disclaimers

**Heading:** What A-List Verification Does Not Mean

**Background:** Light gray or boxed callout — visually distinct from the rest of the page so it reads as the legal section.

**Body:**

> A-List Home Pros is a networking and matching platform. Our verification standards confirm specific facts about our members at the time of verification. They are not guarantees of future conduct or work quality.
>
> Specifically, A-List verification:
>
> - **Is not a guarantee of work quality, project outcomes, or contractor competence.** We verify credentials. We do not supervise, inspect, or warrant any work performed by A-List members.
> - **Is not a substitute for your own due diligence.** Homeowners are encouraged to request current insurance certificates, references, and project portfolios directly from any contractor before signing a contract.
> - **Reflects the status reported as of the verification date.** License, insurance, and business information can change at any time. While we recertify annually and monitor where possible, real-time accuracy cannot be guaranteed.
> - **Does not create an employment, agency, or partnership relationship between A-List Home Pros and any member.** All A-List members are independent businesses operating on their own license, insurance, and authority. They are not employees or agents of A-List Home Pros.
> - **Does not include criminal background checks** as part of the standard verification process. Homeowners who want this additional layer of screening should request it directly or use a third-party background check service.
>
> A-List Home Pros does not perform contracting work. We do not hold member or client funds. We do not guarantee the work, conduct, or outcomes of any A-List member. All contracts for work are between the homeowner and the contractor directly, under a direct agreement that does not involve A-List Home Pros as a party.

### B.10 — Reporting Concerns

**Heading:** Reporting a Concern

**Body:**

> If you have a concern about an A-List member — whether you're a homeowner who has worked with one, another member of the network, or a member of the public — we want to hear about it.
>
> **You can report concerns by:**
>
> 📧 **Email:** jwest@alisthp.com
> 📞 **Phone:** (561) 888-4930
> 📝 **Form:** [Submit a Concern](/contact)
>
> All reports are reviewed by Jeffrey D. West Jr. directly. Substantiated concerns may result in suspension or revocation of A-List status, and we may report serious violations to the Florida DBPR or appropriate licensing authority.
>
> **For urgent safety concerns or complaints about a Florida licensee**, you can also file directly with the Florida DBPR at [https://www.myfloridalicense.com/complaint](https://www.myfloridalicense.com/complaint).

### B.11 — FAQ

**Heading:** Frequently Asked Questions

**Use accordion / expandable Q&A format. Wrap in proper HTML for the FAQ schema.**

**Q: How long does verification take?**
A: For most members, license and insurance verification completes within 2–5 business days of submitting required documentation. Identity verification through our third-party provider typically completes within minutes.

**Q: Do I have to recertify every year?**
A: Yes. All A-List members are recertified annually. We send reminders 30 and 14 days before recertification is due. Members who don't complete recertification within the required window are suspended until they do.

**Q: What if my license is in another state?**
A: A-List Home Pros currently serves South Florida and verifies licenses issued by Florida licensing authorities. Members holding licenses in other states are welcome to apply, but their out-of-state license alone does not qualify them for License-Verified status in Florida. Florida law requires a Florida-issued license for most contracting work performed in Florida.

**Q: Are A-List members background-checked?**
A: Standard A-List verification does not include a criminal background check. We verify license, insurance, and identity. Adding a background check tier is on our roadmap. In the meantime, homeowners who want this layer of screening can request it directly from a contractor or use a third-party service.

**Q: Can I lose my A-List status?**
A: Yes. See "What Revokes A-List Status" above. Status can be suspended or revoked for license issues, insurance lapses, substantiated complaints, fraud, or violations of the platform's terms and community standards.

**Q: Does A-List guarantee the work?**
A: No. A-List Home Pros is a matching platform. We verify credentials, but we do not perform, supervise, or warrant any work performed by our members. All work is performed under a direct agreement between the homeowner and the contractor.

**Q: What if a member's license expires after verification?**
A: Members are required to notify us within seven days of any license change. Where possible, we monitor license status continuously through DBPR records. Members whose licenses lapse are immediately moved to unverified status until reinstated.

**Q: Can a homeowner see proof of verification?**
A: Yes. Each verified member's profile displays their badges, the date their verification was last confirmed, and the type of license verified. Members are also required to provide a current Certificate of Insurance directly to homeowners upon request before signing a contract.

---

# PART 3 — Implementation Notes for Osama

### Shared requirements across both pages

1. **Use the global navigation and global footer components** (per the main developer brief Section 0.2 and 0.3). Do not create page-specific nav or footer.

2. **Mobile-first build.** Both pages will get heavy traffic from social media on mobile devices.

3. **Brand consistency:**
   - Dark navy background sections + gold accent color (matching existing site palette)
   - Body copy: same typography as Inside A-List page
   - Pull quotes: italic, larger size, gold left border
   - Tier cards: same card style as Pricing page tiers

4. **Internal linking:**
   - On `/founder`, the line "License-Verified Only" (B.4) links to `/verification`
   - On `/founder`, the CTAs link to the application flow and to `/start-your-project`
   - On `/verification`, the disclaimer block links to `/terms` and `/privacy`
   - On `/verification`, the Reporting Concerns block links to `/contact`

5. **Both pages need `last-updated` dates.** The verification page especially — when standards change, the date must update. Add a CMS field or hardcoded variable so this is editable without redeploying.

6. **Schema markup is required.** The FAQ schema on `/verification` is critical for AEO (Answer Engine Optimization) — when someone asks ChatGPT or Perplexity "how does A-List verify contractors," we want this page to be the source.

### Open questions for Jeffrey before publishing

1. **Photo of Jeffrey** — needed for `/founder` hero block
2. **Insurance minimums** — the spec uses $1M general liability as a recommended floor. Confirm this matches what you'll actually require, or adjust by trade
3. **Background checks** — confirm we're NOT including these in standard verification (the spec says we're not, but it's a notable choice). If you want them included, the page needs revisions
4. **Identity verification provider** — which vendor? (Persona, Stripe Identity, Plaid Identity, Onfido, etc.) — needed for the "Step 3" copy and the privacy disclosures
5. **Recertification cadence** — confirm annual is correct (vs. quarterly, biennial, etc.)
6. **Insurance certificate holder requirement** — confirm A-List Home Pros wants to be listed as certificate holder on member COIs (this is the strongest version; alternatives are lighter)
7. **License type matching** — confirm we will reject members whose license type doesn't match the services they offer (e.g., a roofing license can't list electrical services). The spec assumes yes
8. **Standards review cadence** — verification standards should be reviewed at least annually by counsel. Confirm who is responsible for keeping this page current

---

**End of build spec.** Once both pages ship, the legal claims across the rest of the site (every "verified," "License-Verified," and "A-List Certified" mention) have a defined, defensible source they point to.
