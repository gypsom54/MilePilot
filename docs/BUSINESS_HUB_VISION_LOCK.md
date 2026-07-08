# MilePilot Business Hub + AI Assistant — Long-Term Vision Lock

**Status:** 🔒 Locked — July 2026  
**Rule:** This document locks future product direction. **Do not implement unless explicitly instructed.**

---

## Current priority (unchanged)

Work remains focused on:

1. AutoPilot testing
2. Background mileage reliability
3. Auto-start detection
4. 90-minute idle auto-end
5. Locked PDF/email reporting stability

After AutoPilot testing is complete and stable, we will begin **planning** the first Business Hub phase — not building it preemptively.

---

## Mission

**MilePilot is the AI Business Companion for the Self-Employed.**

It automatically captures mileage, receipts, expenses and business activity, then turns that data into useful records, reports, insights and accountant-ready exports.

We are not building random features. **We are removing admin from the user's life.**

---

## Product principle

Every feature must do at least one of the following:

- Save the user time
- Reduce manual admin
- Improve tax/reporting confidence
- Organise business records
- Help the user understand their business
- Prepare data for HMRC or accountants

If a feature does not support one of these outcomes, **do not build it**.

*(Aligns with [VISION_LOCK.md](./VISION_LOCK.md) — save time, money, or stress.)*

---

## Business Hub modules (future)

Future Business Hub should include:

| Module | Role |
|--------|------|
| Mileage | Foundation — already in production |
| Trips | Journey history and classification |
| Reports | Locked pipeline — extend only via approved phases |
| Receipts | AI capture + storage |
| Expenses | Structured business spend |
| Fuel | Category + tracking |
| Parking | Category + tracking |
| Tolls | Category + tracking |
| Vehicle Costs | Maintenance, insurance, MOT, tax |
| Tax | Tax year progress and estimates |
| Business Health | 0–100 completeness score |
| Accountant Pack | One-tap export bundle |
| Business Inbox | Calm notification centre |
| AI Assistant | Natural-language queries over user data |

Mileage remains the foundation. MilePilot must evolve **beyond** mileage tracking without rewriting locked systems.

---

## AI receipt scanner (future)

User photographs a receipt. AI extracts:

- Supplier
- Date
- Total amount
- VAT (if present)
- Payment method (if visible)
- Category
- Location (if visible)
- Receipt number (if visible)
- Notes

**Supported categories:** Fuel, Parking, Tolls, Vehicle maintenance, Insurance, Phone, Cleaning, Equipment, Other business expense.

**Rules:**

- User can approve or correct extracted data
- **Never silently accept uncertain data**
- Use confidence scoring
- Low-confidence fields highlighted for review

---

## Expense storage (future)

Structured format. Each expense supports:

| Field | |
|-------|---|
| Date | |
| Supplier | |
| Category | |
| Gross amount | |
| VAT amount | |
| Net amount | |
| Payment method | |
| Receipt image | |
| Business/personal status | |
| Notes | |
| AI confidence score | |
| Created date | |
| Edited date | |

Data must support monthly reports, annual reports, tax summaries and accountant exports.

---

## Business dashboard (future)

Calm, premium business command centre showing:

- Business miles
- HMRC mileage estimate
- Recorded expenses
- Fuel / parking / tolls / vehicle costs spend
- Estimated profit (if income available)
- Missing receipts
- Business Health Score
- Tax year progress
- Accountant pack status

---

## AI business assistant (future)

Answers natural-language questions using the user's MilePilot data.

**Example questions:**

- How did I do today?
- How much did I spend on fuel last month?
- How much can I claim this year?
- Show me every parking receipt.
- What receipts are missing?
- What was my busiest day this month?
- How many miles did I drive last week?
- Export my accountant pack.
- What needs my attention?
- How much VAT have I paid?
- How much did I spend on vehicle maintenance?
- What were my total expenses in June?
- Which supplier did I spend the most with?

Answers must be clear, with numbers, dates and supporting records.

---

## AI business briefing (future)

Signature open experience — personalised daily briefing.

**Example:**

> Good morning, Jonathan.  
> Yesterday you completed 14 business journeys, drove 186.3 miles and generated an estimated £83.84 HMRC mileage claim.  
> All journeys were verified and your report has already been emailed.  
> Two fuel receipts are still missing.  
> Your vehicle insurance renews in 12 days.  
> Business Health: 94/100.  
> Have a productive day.

---

## Proactive AI insights (future)

The assistant surfaces helpful insights without being asked.

**Examples:**

- You filled up twice this week but only uploaded one fuel receipt.
- Fuel costs increased 18% this month.
- You drove 12% more than last week.
- Friday remains your busiest business day.
- You have two missing receipts.
- Your MOT expires in 18 days.
- Your insurance renews soon.
- Your fuel cost per mile improved this month.
- You visited this destination 14 times. Save it as a regular client?
- Your accountant pack is ready.

---

## Business Health Score (future)

Score from **0–100** considering:

- Trips recorded
- Missing journeys
- Missing receipts
- Expense completeness
- Report delivery status
- Tax year progress
- Vehicle admin reminders
- Accountant pack readiness

**Example:**

> Business Health: 92/100 — Excellent.  
> Every trip recorded. No missing mileage. Fuel receipts complete. Parking receipts complete. Tax records up to date. Two receipts need review.

---

## Business Inbox (future)

Calm business notification centre for important activity:

- Today's report sent
- Receipt processed
- HMRC estimate updated
- Accountant pack ready
- Insurance renewal due
- MOT due
- Vehicle tax due
- Mileage synced
- Expense approved
- AI insight available

---

## Accountant Pack (future)

One-tap export (**MilePilot Business** tier):

- Mileage PDF reports
- Mileage CSV
- Expense CSV
- Receipt images
- Receipt summary
- HMRC mileage estimate
- Tax year summary
- Verification certificate
- AI summary notes

---

## Subscription strategy (future)

### MilePilot Core — approx £4.99/month

- Manual tracking
- AutoPilot mileage tracking
- PDF reports
- Email reports
- HMRC mileage estimates
- Journey history

### MilePilot Business — approx £9.99/month

Everything in Core, plus:

- AI receipt scanning
- Unlimited expense tracking
- Business Hub
- AI Assistant
- Business Health Score
- Business Inbox
- Accountant Pack
- Tax dashboard
- Fuel, parking and toll tracking
- Smart reminders
- AI business insights

The £9.99 tier must feel **obviously more valuable** than mileage tracking alone.

*(See also tier framing in [VISION_LOCK.md](./VISION_LOCK.md) — Tracker £5.99 / Business £9.99 targets.)*

---

## Implementation rules (mandatory)

### Do not disturb locked systems

| System | Status |
|--------|--------|
| PDF reports | 🔒 Locked — [TEMPLATE_LOCK_REPORTS.md](./TEMPLATE_LOCK_REPORTS.md) |
| Email templates | 🔒 Locked |
| Manual tracking | Must remain working |
| AutoPilot | Must remain working |
| Background GPS / native engine | Must remain working |

Future Business Hub features **extend** the existing system — they do not rewrite it.

### Build discipline

- Build in phases
- Avoid major redesigns once sections are approved
- Follow: **One phase → One objective → Test → Approve → Lock → Move on**

---

## Relationship to existing docs

| Document | Scope |
|----------|--------|
| [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md) | **Active** engineering order (tracking first) |
| [VISION_LOCK.md](./VISION_LOCK.md) | Platform tiers, Business Profile, design principles |
| [ROADMAP.md](./ROADMAP.md) | Sprint history and phase pointers |
| **This document** | Business Hub + AI Assistant **future** specification |

---

## What this document authorises

- Planning and design discussions for Business Hub phases
- Architecture sketches that do not touch locked reporting code
- Subscription tier definitions in docs and feature registry (gating only)

## What this document does NOT authorise

- Implementing receipt scanner, expenses, Business Inbox, or AI Assistant UI
- Changing locked PDF or email templates for Business Hub features
- Dashboard or navigation redesign for Business tier
- Shipping Business-tier billing before Core/AutoPilot is field-validated

---

## North star (unchanged)

**The AI Business Companion for the Self-Employed.**

Mileage is proven first. Business Hub is the long-term platform.
