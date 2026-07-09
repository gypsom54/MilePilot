# RankAura Brand — Official Design Bible

**Status:** Permanent brand direction — locked  
**Authority:** Overrides conflicting copy, visuals, and product messaging everywhere  
**Last updated:** July 2026

> Nothing should be implemented that conflicts with this document.  
> When in doubt, ask: *Does this help the customer feel their business is growing?*

---

## Company

| Element | Value |
|---------|--------|
| **Company name** | RankAura |
| **Brand promise** | **We Help Grow Businesses.** |
| **Customer buys** | Business growth — not AI, not SEO software |
| **AI role** | Invisible. Works quietly. Customer sees outcomes only. |

---

## Brand promise (canonical)

### We say

**"We Help Grow Businesses."**

### We do not say (deprecated messaging)

- AI Growth Manager
- SEO Automation
- AI Employees (customer-facing)
- Autonomous SEO
- Technical AI terminology
- "Your AI Growth Employee" (legacy tagline — retire)
- "AI Operating System" (customer-facing)

The customer is **not** buying AI. They are buying **peace of mind, confidence, growth, time back, and more enquiries**.

---

## Logo

### Official identity

Implement the approved RankAura logo concept across all surfaces:

| Property | Specification |
|----------|---------------|
| Mark | Minimal **RA** monogram — `public/brand/rankaura-mark.svg` |
| Colour | Premium blue gradient `#2563EB` → `#60A5FA` on deep navy `#0B1526` |
| Geometry | Rounded, elegant proportions |
| Spacing | Premium — never cramped |

### Logo must appear on

- Welcome screen
- Onboarding
- Dashboard
- Mission pages
- Reports
- Emails
- Loading screens
- PDF reports
- Website / marketing

### Colour palette (logo-aligned)

| Token | Use |
|-------|-----|
| Deep navy | Primary surfaces, buttons, text |
| White / off-white | Backgrounds, breathing room |
| Premium blue gradient | Logo mark, subtle accents only |
| Soft emerald | Success, growth confirmation |

**Avoid:** clutter, rainbow UI, loud gradients on large surfaces, cheap SaaS aesthetics.

---

## Home / welcome screen

The welcome screen direction is **approved**. Keep:

- Large typography
- Lots of whitespace
- Minimal design
- Simple interaction
- Gentle animations

### Canonical copy

| Element | Copy |
|---------|------|
| Eyebrow | **Welcome to RankAura** |
| Headline | **We Help Grow Businesses.** |
| Subheading | We'll quietly improve your online presence while you focus on running your business. |
| Primary button | **Get Started** |

### Replaces (do not use)

- ~~Welcome to Aura~~
- ~~I'll grow your business while you focus on running it.~~ (superseded by brand promise + subheading)

---

## Onboarding

Onboarding stays **incredibly simple**. Customer provides only:

1. **Business name**
2. **Website**
3. **One short business description**

### Example description

> I run a hypnotherapy practice in Portsmouth helping people stop smoking and reduce anxiety.

That is enough. **RankAura handles everything else.**

### Rules

- No complicated forms
- No SEO questions
- No technical setup
- No keywords, schema, sitemap, or meta tag questions
- Experience must feel **magical** — like hiring a team, not configuring software

### Analysis sequence (approved pattern)

Checkmark progression — not spinners:

- Reading website
- Understanding business
- Finding opportunities
- Planning improvements
- Building your growth plan *(customer-facing — not "Growth Team" jargon)*
- Preparing first mission

After analysis → **Dashboard directly**. No settings. No configuration.

---

## Visual style

### Inspiration

Apple · Linear · Stripe · Notion · Arc Browser

### Feel

| ✓ | ✗ |
|---|---|
| Calm | Cluttered |
| Premium | Cheap / generic SaaS |
| Minimal | Information overload |
| Confident | Anxious / busy |
| Modern | Dated dashboard widgets |
| Expensive | Flashy |

### Layout principles

- One primary action per screen
- Large whitespace
- Strong typographic hierarchy
- Soft cards, subtle shadows
- No unnecessary borders
- No charts unless they answer *"Is my business growing?"*

---

## Motion

Subtle premium animations only.

| Approved | Examples |
|----------|----------|
| Typing text | Aura insights, brief messages |
| Progress bars | Onboarding analysis, calm completion |
| Fade transitions | Screen changes, onboarding steps |
| Soft card animations | Enter, hover |
| Smooth loading | Checkmarks, not spinners |

| Forbidden |
|-----------|
| Flashy effects |
| Particles / busy backgrounds (Mission Mode style) |
| Constant live feeds |
| Motion that demands attention |

---

## Customer experience

The customer should feel they **hired a team** — not bought software.

### Voice

- Reassuring
- Simple English
- First person from RankAura/Aura: *"We've…"*, *"We found…"*
- Celebrate wins — make them smile

### Examples (use)

- "Good morning Jonathan."
- "We've found another opportunity."
- "We published a new page."
- "Google has indexed your article."
- "We're improving your local visibility."
- "We fixed duplicate content issues that could affect your visibility."

### Never say (unless customer explicitly asks)

| Banned term | Say instead |
|-------------|-------------|
| Canonical | We fixed duplicate content issues |
| Schema | We helped Google understand your business |
| Meta tags | We improved how your page appears in search |
| Robots.txt | We updated how search engines access your site |
| Indexability | Google can now find your new page |
| Keyword cannibalisation | We resolved competing pages |
| Internal link graph | We connected your pages so customers find answers |
| SERP, backlinks, crawl budget | *(plain business outcome)* |

Translate all technical work into **business language**.

---

## Screen mission

Every screen answers **one question**:

| Screen | Question |
|--------|----------|
| Welcome / onboarding | *Can I trust RankAura to grow my business?* |
| Dashboard | *Is everything okay?* |
| Mission / approval | *What needs my approval?* |
| Report | *Is my business growing?* |
| Notification | *What did RankAura improve today?* |

### North star (all screens)

**"Is my business growing?"**

If yes → screen succeeds.  
If not → redesign.

### Success metric

Customer logs in for **less than five minutes** and leaves feeling:

> Everything is under control.

---

## Design philosophy

RankAura should feel **less like SEO software** and more like:

**Apple meets Stripe meets Tesla**

- Simple
- Elegant
- Calm
- Beautiful
- Premium

The customer should **smile** every time they open the dashboard.

---

## Implementation checklist (for engineers)

Before merging any UI work, verify:

- [ ] Copy uses **We Help Grow Businesses.** positioning (not AI/SEO product language)
- [ ] No banned SEO jargon in user-facing strings
- [ ] Logo / RA monogram used per spec (when asset available)
- [ ] One question per screen; one primary CTA
- [ ] Motion is subtle, not distracting
- [ ] Technical work translated to business outcomes
- [ ] Aligns with `docs/RANKAURA_SIMPLICITY_PLAN.md`
- [ ] Does not contradict this document

---

## Related documents

| Document | Path |
|----------|------|
| **Brand bible (locked)** | `docs/RANKAURA_BRAND.md` |
| Constitution / experience | `docs/AURA.md` |
| Simplification roadmap | `docs/RANKAURA_SIMPLICITY_PLAN.md` (this file) |
| Architecture decisions | `docs/DECISIONS.md` |
| System map | `docs/SYSTEM_MAP.md` |

---

## Deprecated (effective immediately)

| Item | Replacement |
|------|-------------|
| "Your AI Growth Employee" tagline | We Help Grow Businesses. |
| "Welcome to Aura" | Welcome to RankAura |
| Customer-facing "AI employees" | Team / we / RankAura outcomes |
| "AI Growth Operating System" | Growth partner for small businesses |
| Mission Mode immersive terminal UI | Calm approve flow (simplicity plan) |
| Avoid all gradients (old AURA.md) | Logo gradient only; surfaces stay calm |

---

*This is the official RankAura design language. Do not deviate.*
