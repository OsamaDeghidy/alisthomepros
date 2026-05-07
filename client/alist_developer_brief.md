# A-List Home Pros Website — Developer Correction Brief

**For:** Web developer
**From:** Jeffrey D. West Jr.
**Site:** www.alisthomepros.com
**Date:** May 2, 2026
**Goal:** Eliminate legal exposure, fix inconsistencies across pages, align messaging with Phase 1 (founding pro network only), maintain premium brand voice.

How to use this doc: Each section is a page. Each item has the **current copy/element**, the **problem**, and the **fix**. Work top to bottom. Items marked 🚨 are legal-risk items — do not skip.

---

## SECTION 0 — Site-Wide Inconsistencies (Fix First)

These problems appear on multiple pages. Fix once, apply everywhere.

### 0.1 🚨 Pricing is inconsistent across pages
- **Pricing page** says: Home Pro $200 → $100/mo founding rate, Crew Member $80 → $50/mo founding rate
- **About page** says: Home Pro $174.99/mo, Crew Member $124.99/mo
- **Fix:** Pick one set of numbers. Pricing page numbers are the correct ones. Update About page to match. Audit every page for any other pricing mentions.

### 0.2 Navigation menu is different on every page
Top nav menu items vary by page:
- **Home page nav:** Home / About / Inside A-List / Pricing / Open App
- **About page nav:** Home / About / Gallery / Network Hub / Investors / Contact / Open App
- **Pricing page nav:** Home / About / Inside A-List / Investors / Pricing / Open App
- **Investors page nav:** Home / About / Inside A-List / Pricing / Open App

**Fix:** Use ONE global navigation component on every page. Recommended order:
**Home / About / How It Works / Pricing / Investors / Contact / Open App**

### 0.3 Footer is different on every page
Some pages have full footer (Company / Resources / Investors / Legal columns), some have minimal footer (Platform / Gateway).

**Fix:** Use ONE global footer component. Use the full version everywhere.

### 0.4 🚨 Add legal disclaimer block to global footer
Insert above the copyright line on every page:

> *A-List Home Pros is a networking and marketplace platform. We do not perform contracting work, hold member or client funds, or guarantee the work, conduct, or outcomes of any member. License verification reflects status reported by the Florida DBPR as of the verification date and may change. Members are independent businesses, not employees or agents of A-List Home Pros. Nothing on this website constitutes legal, financial, or tax advice. Investment opportunities are limited to qualified investors per applicable securities exemptions.*

### 0.5 🚨 Site-wide find-and-replace
| Find | Replace with |
|---|---|
| Project Funds Account | Milestone Payment Release |
| Funds protection / funds are secured | Milestone-based payment release through our payment partner |
| verified and validated | license-verified |
| Property Owner | Homeowner |
| 5k+ Florida Pros | Building South Florida's founding pro network |
| 4.9/5 RATING | (delete entirely) |
| FLORIDA TRUST / PRO SECURE / ELITE HUB badges | (delete or replace with real certifications when available) |

### 0.6 CTA verb consistency
Currently buttons say: Open App, Enter the Network, Join Now, Become a Pro, Join a Crew, Secure Lifetime, Get Started Free, Register Now, Enter Inside A-List, Get Matched Now.

**Fix:** Use these three verbs only:
- **"Apply"** — for membership applications
- **"Reserve My Spot"** — for the $100 founding member deposit
- **"Open App"** — for taking existing members into the app

### 0.7 Terminology unification
Pick one term and use it everywhere on the site AND inside the app:

| Concept | Use this | Stop using |
|---|---|---|
| Person hiring | Homeowner | Property Owner, Client, Customer |
| Pulse member status | Live | Active, Online, Available |
| Membership tier | Founding Member / A-List Certified | Elite, Gold Standard, Network Access |
| Verification | License Verified | Certified, Validated, Verified (when undefined) |

---

## SECTION 1 — Homepage (`/`)

### 1.1 Hero section
**Current:**
- H1: "South Florida's Private Network."
- Subhead: "Where top Home Pros, skilled crews, and serious property owners connect, get hired, and get projects done right."
- CTAs: "Enter the Network" / "How It Works"

**Problems:**
- Speaks to homeowners ("property owners") when Phase 1 is pro-only
- Generic — doesn't communicate the founding-member opportunity

**Fix — replace with:**
- H1: "South Florida's Founding Pro Network."
- Subhead: "Get in before the homeowner side launches. Founding members lock in charter pricing, priority placement, and lifetime status — limited to 1,000 spots."
- Primary CTA: "Apply for Founding Membership"
- Secondary CTA (text link): "How It Works"

### 1.2 🚨 "Need a Pro?" homeowner panel
**Current:** Floating card on hero saying "Need a Pro? Tell us what you need and we'll connect you with the right A-List professional. [Continue Inside the Network]"

**Problem:** Homeowner side is not live in Phase 1. Generates leads with no fulfillment.

**Fix:** Remove from hero. Replace later in page with a Waitlist section (see 1.6).

### 1.3 🚨 "5k+ Florida Pros" and "4.9/5 RATING"
**Problem:** Unverifiable. FTC Section 5 risk for material false claims.

**Fix:** Delete both. Replace with: *"Founding Network — Limited Charter Spots Remaining"*

### 1.4 "FLORIDA TRUST / PRO SECURE / ELITE HUB" badges
**Problem:** Not real certifications. Visual clutter that looks fake.

**Fix:** Delete unless real third-party certifications can be substituted (e.g., BBB accreditation, SSL badge, Florida Chamber of Commerce, etc.)

### 1.5 "Choose Your Role" section — five role cards
**Current:** Home Pro / Crew Member / I Need a Pro / Specialist / Want to Earn

**Problems:**
- Five paths is too many — decision paralysis
- "I Need a Pro" doesn't fit Phase 1
- Different CTA verbs per card ("Enter Inside A-List" on every card actually — keep this consistent)

**Fix:**
- Show only **two primary cards** above the fold: "I Am a Home Pro" and "I Am a Crew Member"
- Place "I Am a Specialist" and "I Want to Earn" inside a collapsed accordion below labeled **"More Ways to Join"**
- Delete "I Need a Pro" card entirely (replaced by waitlist in 1.6)
- All four remaining cards use CTA: **"Apply"**

### 1.6 NEW SECTION — Add Homeowner Waitlist (replaces removed homeowner content)
Add this section between the comparison table ("Traditional Platforms vs. A-List Network") and "Get In Early. Win Bigger.":

**Heading:** "Are You a Homeowner?"

**Body:** "A-List opens to homeowners after our founding pro network is complete. Join the launch waitlist — we'll notify you the moment we open in your area."

**Form fields:**
- First Name (required)
- Email (required)
- ZIP code (required)
- Project Type (optional dropdown)

**Submit button:** "Join Waitlist"

**🚨 Add consent text above the submit button:**

> *By submitting, I agree A-List Home Pros may contact me by email about the launch. I can unsubscribe at any time. See [Privacy Policy](/privacy) and [Terms](/terms).*

### 1.7 🚨 "Tell Us About Your Project" form (current homepage form)
**Current:** Collects name, email, phone, project type, budget, timeline, location, description with no consent language.

**Problems:**
- TCPA / Florida Telephone Solicitation Act risk — collecting phone with no SMS consent
- CAN-SPAM risk — no opt-in language
- Lead-gen disclosure requirement — no notice that info will be shared

**Fix:** Either delete this form entirely (since homeowner side isn't live) OR replace with the Waitlist form in 1.6.

If keeping any version of a project-submission form, add this consent block immediately above the submit button:

> *By submitting, I agree A-List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with matched A-List members. Message and data rates may apply. Reply STOP to unsubscribe. See [Privacy Policy](/privacy) and [Terms](/terms).*

Plus a separate **unchecked** checkbox:
> ☐ *I'd like to receive marketing communications from A-List Home Pros.*

### 1.8 "JW AS MK" avatar stack
**Problem:** Three random initials with no context. Unclear what this represents.

**Fix:** Either replace with real founding member avatars + names + titles, or delete.

### 1.9 "Get In Early. Win Bigger." section
**Currently good.** Keep. But add a specific founding-member benefit list with monetary value:

> **Founding Member Benefits:**
> - Charter pricing locked for life ($100/mo vs. $200/mo public rate — save $1,200/year)
> - Founding-member badge displayed on profile
> - Priority placement in PULSE map results
> - Direct line to the founder
> - Invite-only launch event access

### 1.10 Final CTA section — "Your Network Determines Your Opportunities"
**Currently OK.** Just change CTA text from "Enter the Network" to "Apply for Founding Membership" so it matches the hero.

---

## SECTION 2 — About Page (`/about`)

⚠️ **Note:** The /about URL currently shows Specialist content but search results indicate it should show the founder's message and brand story. Confirm with developer which page is the canonical About page.

### 2.1 🚨 "Project Funds Account" feature card
**Current:** "All payments are secured in your Project Funds Account until milestones are completed."

**Problem:** Florida Chapter 560 (money transmitter) risk. Implies A-List holds funds.

**Fix:** Replace card title and description with:
> **Milestone Payment Release**
> *Payments are processed and released by our licensed payment partner, [Stripe Connect / Escrow.com — confirm with Jeffrey], based on completed project milestones. A-List Home Pros does not hold member or client funds.*

### 2.2 🚨 Pricing inconsistency
**Current:** Home Pro $174.99/mo, Crew Member $124.99/mo

**Fix:** Match Pricing page numbers exactly. Either:
- Remove pricing from About page and link to /pricing instead, OR
- Update to: Home Pro $200 → $100/mo founding rate, Crew Member $80 → $50/mo founding rate

Recommendation: Remove pricing from About entirely. Pricing belongs on /pricing only.

### 2.3 "$0 Forever" Network Access tier
**Problem:** "Forever" is a guarantee. Avoid.

**Fix:** Change to "$0/mo — basic access" or "Free — limited features."

### 2.4 "Specialists represent the top 1%" claim
**Problem:** Unverifiable percentile claim.

**Fix:** Replace with: *"Specialists are vetted project managers and master tradespeople with documented experience handling multi-trade residential and commercial contracts."*

### 2.5 🚨 "Verified Trade Badges" feature
**Problem:** "Verified" used without definition.

**Fix:** Add tooltip or footnote: *"Trade badges reflect license status and trade certifications confirmed at time of verification. See [Verification Standards](/verification) for full details."*

### 2.6 🚨 Add founder bio section
**Currently missing.** Per the search results, the About page should contain Jeffrey's founder message.

**Add a section near the top of the About page:**

> **Built by a South Florida Contractor**
> [Photo of Jeffrey D. West Jr.]
>
> Jeffrey D. West Jr. founded A-List Home Pros after years in South Florida construction. He saw too many skilled contractors lose to lead-gen platforms that sold their leads to five competitors at once. A-List is the alternative.
>
> [Read the Founder's Message →]

Link to a dedicated `/founder` page if not already present, containing the longer founder narrative from the existing About content (the "I built this because the industry I love..." section is strong copy — keep it on a founder page).

### 2.7 🚨 "Network Multipliers" / "earn referral bonuses that multiply"
**Problem:** Vague. May trigger MLM/pyramid scheme regulatory scrutiny depending on how multi-level the structure actually is.

**Fix:** Define specifically:
- "Per-Project Referral Bonus: Earn a one-time fee when a contractor you refer completes their first paid project."
- "Recurring Referral Income: Earn $X/month for each active referred member, paid monthly while they remain subscribed."

If the program is more than two levels deep (you earn from people your referrals refer), have an attorney review the structure against Florida pyramid scheme statutes (F.S. 849.091).

---

## SECTION 3 — Pricing Page (`/pricing`)

### 3.1 🚨 Remove Lifetime tiers
**Current:** "Home Pro — Lifetime $5,000" and "Crew Member — Lifetime $3,500"

**Problems:**
- Asking pre-revenue prospects to pay $5,000 with no homeowner side live yet damages trust
- High-dollar lifetime tier without proven value = consumer protection complaint risk

**Fix:** Remove both tiers from the live page. Save as drafts. Re-introduce post-launch when there's documented homeowner traction.

### 3.2 ADD — Founding Member tier (new top card)
Add a new tier card at the top of the pricing grid, marked as recommended:

```
🏆 LIMITED — CHARTER SPOTS

Founding Member
$100 deposit

Applied to your first 3 months of membership upon launch.

✓ Charter pricing locked for life ($100/mo vs $200/mo public rate)
✓ Founding-member badge on profile
✓ Priority placement in PULSE map
✓ Direct line to the founder
✓ Invite-only launch event access
✓ First-look access to homeowner leads at launch

[Reserve My Spot]
```

### 3.3 Mark other tiers as "Available After Launch"
For Network Access ($0), Home Pro ($100/mo founding rate), and Crew Member ($50/mo founding rate), add a label: **"Available After Public Launch"** so it's clear the only live action right now is the Founding Member deposit.

### 3.4 🚨 "Project Funds Account" feature
**Current:** Listed as a feature.

**Fix:** Rename to "Milestone Payment Release (powered by [payment partner])" and add disclaimer below the feature grid:
> *A-List Home Pros does not hold member or client funds. All payments are processed and released by our licensed payment partner.*

### 3.5 🚨 "Every member is verified and validated"
**Current:** In the comparison table.

**Fix:** Replace with: *"Every member's professional license is verified at time of certification."*

### 3.6 🚨 "Property owners know every pro is A-List certified"
**Current:** In comparison table.

**Problem:** This is a guarantee statement.

**Fix:** Replace with: *"Homeowners can see each member's verification status and certification badges before connecting."*

### 3.7 "Three Steps to the Gold Standard" — clarify referral structure
**Current:** "Active Multipliers — Every successful milestone in your network triggers a builder reward."

**Problem:** Vague. Triggers same MLM concern as 2.7.

**Fix:** Be specific. Replace with concrete language:
> **01 — Invite Pros**
> Send your unique referral link to other contractors and crews.
>
> **02 — Earn on Each Subscription**
> When a referred member subscribes to A-List, you earn $15/month while they're active.
>
> **03 — Scale Your Network Income**
> No cap on referrals. Payouts processed monthly via [payment partner].

### 3.8 "Three Steps" → step 02 says "builder reward"
**Problem:** Undefined term.

**Fix:** Use "monthly referral payout" or "recurring referral income" — match terminology used elsewhere on the site.

### 3.9 Add launch date placeholder
Add to the bottom of the pricing page:

> **Founding network closes [DATE].**
> **Public launch [DATE].**
> *(Confirm dates with Jeffrey before publishing.)*

---

## SECTION 4 — Inside A-List Page (`/inside-a-list`)

### 4.1 🚨 "0 / 1000 Secured" Founders Circle counter
**Current:** Shows live count of 0/1000.

**Problem:** Public "0" is deflating social proof and signals nobody has joined.

**Fix:**
- **Short term:** Hide the counter entirely. Replace with static copy:
  > *Charter membership is limited to 1,000 founding pros. Apply now to lock in founding rates for life.*
- **Once 25+ members confirmed:** Re-enable the counter, animating up from 0.

### 4.2 Placeholder "A-List Spotlights" (Apex Builders, David M., The Boca Reveal)
**Problem:** These appear fictional. Premium brand positioning is undercut by fake content.

**Fix:** Either:
- Replace with real founding-member spotlights (with their consent and signed photo/quote release), OR
- Replace section with placeholder text: *"Founding Member Spotlights — coming soon. Want to be featured? [Apply for founding membership →]"*

### 4.3 Placeholder video thumbnails (1:45, 2:15, 3:00, 4:20, 5:15, 3:40 durations)
**Problem:** Video durations shown but no actual videos. Looks broken.

**Fix:** One of:
- Ship real videos (preferred — Jeffrey's founder message exists per memory)
- Show a "Coming soon — [date]" overlay on each thumbnail
- Hide the entire "How It Works" and "Platform Walkthroughs" sections until videos exist

### 4.4 🚨 "Project Funds Account" in Centralized Command grid
Same fix as 2.1 and 3.4. Rename to "Milestone Payment Release." Add disclaimer.

### 4.5 🚨 "Direct, encrypted collaboration between roles"
**Problem:** "Encrypted" is a specific technical claim that creates legal liability if untrue (e.g., end-to-end encryption requires specific implementation).

**Fix:** Replace with: *"Direct in-app messaging between roles."* If the messaging is actually end-to-end encrypted, document it on a security page. Otherwise drop the word.

### 4.6 🚨 "Real-time visibility into every construction phase"
**Problem:** Implies A-List monitors job site progress, which creates implied responsibility for project outcomes.

**Fix:** Replace with: *"Job tracking tools for members to update project phases."*

### 4.7 "How A-List Protects Everyone — The mechanisms keeping bad actors out"
**Problem:** "Protects" is a strong guarantee word.

**Fix:** Replace with: *"How A-List Maintains Network Standards"* — and in the description, list the specific verification steps (license check, insurance check, background check, etc.) without using the word "protects."

---

## SECTION 5 — Investors Page (`/investors`)

🚨 **CRITICAL:** This page solicits investment. SEC and Florida securities laws apply. Have a securities attorney review before this page goes live in any form. The fixes below are necessary but not sufficient.

### 5.1 🚨 No securities disclaimer
**Currently missing entirely.** Required.

**Fix — add to top of the page (above the hero), as a banner:**

> ⚠️ *This page contains forward-looking statements about A-List Home Pros' business plans. Any investment opportunities are offered only to qualified investors under applicable securities exemptions (Rule 506(b) / 506(c) / Reg CF / Reg A — confirm with counsel). Nothing on this page constitutes an offer to sell or a solicitation of an offer to buy any security in any jurisdiction where such offer or solicitation would be unlawful. Past performance does not guarantee future results. Investing in early-stage companies involves significant risk, including total loss of capital.*

### 5.2 🚨 "Invest with A-List" CTA goes to a contact form
**Problem:** No accredited investor verification step. Under Reg D 506(c) general solicitation rules, you must verify accredited status before accepting investment from anyone who responded to public marketing.

**Fix:** Either:
- Change CTA to **"Request Investor Package"** (information only, not investment) and gate the actual investment opportunity behind an accredited investor verification flow on a separate, non-public URL, OR
- If using Reg CF (crowdfunding), the CTA must direct to a registered FINRA portal (Republic, StartEngine, etc.) — not a custom form

### 5.3 🚨 "$600B+ US Home Services Market"
**Problem:** Needs a citation.

**Fix:** Add footnote: *"Source: [IBISWorld / HomeAdvisor State of Home Services 2024 / etc.]"* If you can't cite it, remove it.

### 5.4 🚨 "60% Contractor Churn on Legacy Platforms"
**Problem:** Needs a citation.

**Fix:** Same as 5.3. Cite source or remove. The About page references this as "Research consistently shows..." — that's not a citation. Find the actual study (Software Advice 2022 contractor survey? IBISWorld? PRC report?) and link it.

### 5.5 🚨 "Zero Real-Time Vetting Infrastructure"
**Problem:** Sweeping claim about competitors. Defamation risk if specific competitor named.

**Fix:** Soften to: *"Limited real-time verification on legacy platforms"* and don't name competitors negatively in marketing copy.

### 5.6 🚨 "10X Project Growth Rate"
**Problem:** Unclear what this measures. Without context, looks like puffery.

**Fix:** Either:
- Provide specific metric: *"South Florida construction permits grew 10x faster than national average in [year] — Source: [Florida DBPR / US Census]"*
- Or remove

### 5.7 🚨 "Premium Market Positioning" / "Scalable Infrastructure Model"
**Problem:** These appear as if they're statistics (next to $600B and 60%) but they're descriptors, not metrics.

**Fix:** Restructure the stats grid. Show only quantitative data with sources:
- $600B — US Home Services Market (source)
- 60% — Contractor churn on legacy platforms (source)
- [Real growth metric for SoFla — e.g., construction permit data]

### 5.8 🚨 "AI-driven validation of credentials, history, and performance"
**Problem:** Specific tech claim. Implies automated underwriting/credit-decisioning, which has FCRA implications if it affects who gets work.

**Fix:** Replace with: *"Multi-step verification process including license confirmation, insurance verification, and identity validation."*

### 5.9 🚨 "Financial Shield — Integrated milestone-based payments and funds protection"
**Problem:** Same Chapter 560 risk as everywhere else, AND "Financial Shield" implies guarantees that aren't there.

**Fix:** Replace card with:
> **Milestone Payment Workflow**
> *Integrated milestone-based payment release through our licensed payment partner. A-List Home Pros does not hold funds.*

### 5.10 🚨 "We've built an ecosystem"
**Problem:** Past tense overstates what's built. Phase 1 means parts are still in development.

**Fix:** Change to: *"We're building an ecosystem"* — present continuous tense is honest and still investor-friendly.

### 5.11 Missing — Risk factors section
**Required for any investor solicitation.**

**Add a "Risk Factors" section** at the bottom of the page covering at minimum:
- Early-stage company risk
- Market risk / competition
- Regulatory risk (Florida contractor licensing, payment processing, lead generation)
- Key person risk (founder dependency)
- Liquidity risk
- Total loss of investment

Have securities counsel draft the actual language. Don't write this yourself.

### 5.12 Missing — Use of funds, team, traction
Investor pages typically include:
- Founder/team bios with photos
- Use of funds breakdown (% to product, % to marketing, % to ops)
- Traction metrics (users, revenue, partnerships)
- Capital structure / round details

**Fix:** Add these sections, OR explicitly mark the Investors page as "Investor Information Request" and gate the detailed deck behind the form.

---

## SECTION 6 — New Pages to Create

### 6.1 `/founder` — Founder's Message page
Use the existing founder narrative from About ("I built this because the industry I love...") on a dedicated page. Link from About bio block.

### 6.2 `/verification` — Verification Standards page
Document exactly what "license-verified" and "A-List Certified" mean:
- License check (DBPR public records lookup)
- Insurance certificate on file
- Identity verification (vendor name + method)
- Recertification cadence
- What revokes status

### 6.3 `/safety` — already exists, audit it
Confirm /safety page reflects the actual safety/dispute resolution process, not aspirational language. Have attorney review.

### 6.4 `/privacy` and `/terms` — already exist, attorney review required
Both pages must be reviewed by counsel before any of the form/consent changes above go live, since the consent text references these documents.

### 6.5 `/investor-disclosure` — NEW
Full risk factors and securities disclaimers, linked from the Investors page.

---

## SECTION 7 — Acceptance Checklist for Developer

Before deploying any of these changes to production, confirm:

**Site-wide**
- [ ] One global navigation component, identical on every page
- [ ] One global footer component, identical on every page
- [ ] Legal disclaimer block in footer of every page
- [ ] All find-and-replace items from 0.5 completed
- [ ] All CTAs use one of three approved verbs (0.6)
- [ ] Pricing matches across all pages (0.1)

**Homepage**
- [ ] Hero rewritten for pros (1.1)
- [ ] Homeowner project form removed or converted to waitlist (1.7)
- [ ] "5k+ Florida Pros" and "4.9/5" deleted (1.3)
- [ ] Role cards reduced to 2 primary + accordion (1.5)
- [ ] Homeowner waitlist section added (1.6)

**About**
- [ ] Project Funds Account renamed (2.1)
- [ ] Pricing matches Pricing page or removed (2.2)
- [ ] Founder bio section added (2.6)
- [ ] Verification claims qualified (2.5)

**Pricing**
- [ ] Lifetime tiers removed (3.1)
- [ ] Founding Member tier added on top (3.2)
- [ ] Other tiers marked "Available After Launch" (3.3)
- [ ] Referral steps clarified (3.7, 3.8)

**Inside A-List**
- [ ] 0/1000 counter hidden or reframed (4.1)
- [ ] Placeholder spotlights and video thumbnails handled (4.2, 4.3)
- [ ] "Encrypted" claim removed (4.5)
- [ ] "Protects" language softened (4.7)

**Investors**
- [ ] Securities disclaimer banner added (5.1)
- [ ] CTA repositioned as info request, not investment offer (5.2)
- [ ] All stats cited or removed (5.3 – 5.7)
- [ ] "Financial Shield" replaced (5.9)
- [ ] Risk factors section added (5.11)

**Forms**
- [ ] All forms have consent language above submit
- [ ] All forms have separate marketing opt-in checkbox
- [ ] All forms have inline validation and post-submit confirmation
- [ ] All forms link to /privacy and /terms

---

## SECTION 8 — Open Questions for Jeffrey

The developer cannot complete this work without answers to:

1. Which payment processor is the milestone-release feature using? (Stripe Connect, Escrow.com, Plaid, etc.) — needed for "powered by" copy throughout
2. What's the public launch date and the founding-network-closes date?
3. Has the $100 founding member deposit flow been built in Base44? Where does "Reserve My Spot" link to?
4. Has a securities attorney reviewed the Investors page? If not, take it offline until they do
5. Has a Florida construction/business attorney reviewed the verification claims and "A-List Certified" definition?
6. Are there real founding members whose names/photos can replace the placeholder spotlights?
7. Confirm pricing: is the public rate $200/mo or $174.99/mo? Founding rate $100/mo or $124.99/mo?
8. Is the referral program structured as 1-level (you earn from your direct referrals only) or multi-level (you earn from your referrals' referrals)?

---

**End of brief.** Items marked 🚨 should be fixed before any new traffic, paid ads, or investor outreach. Everything else can be sequenced in two-week sprints.
