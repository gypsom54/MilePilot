# MilePilot Product Strategy — LOCKED

Do not change without explicit product sign-off.

## Two primary workspaces

### 1. Mileage Workspace

**Purpose:** Capture business journeys automatically.

**Target:** Users whose primary need is mileage tracking.

**Plan:** MilePilot Core (£4.99/month).

**Includes:**
- AutoPilot or Manual mileage tracking
- HMRC mileage estimates
- PDF & email reports

### 2. Business Workspace

**Purpose:** Organise and understand business records.

**Target:** Self-employed professionals and small businesses who want less admin.

**Plan:** MilePilot Business (£9.99/month).

**Includes:**
- AI Receipt Scanner
- Expenses
- VAT
- AI Bookkeeper
- Accountant Pack
- Business Health
- Business Inbox
- Reports

The Business Workspace is the **flagship premium experience** — not an add-on.

## Onboarding rules

Onboarding determines which workspace is presented first:

| User type | First workspace | Plan |
|-----------|-----------------|------|
| Mileage only | Mileage Workspace | Core |
| Business only | Business Workspace | Business |
| Both selected | Combined workspace | Business |

**Never:**
- Force Business users through mileage setup
- Force Mileage users through Business Workspace setup
- Present either workspace as incomplete without the other

Each workspace must feel complete in its own right.

## Implementation

- Logic: `frontend/js/business-setup-onboard.js`
- Dashboard layout: `MPBusinessSetup.applyDashboardLayout()`
- Storage: `mp_business_setup`, `dashboardMode` (`mileage` | `business` | `mixed`)
