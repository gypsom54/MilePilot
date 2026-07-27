import type { GrowthPlanData } from "@/types/growthPlan";

const GROWTH_TEAM_CHECKLIST = [
  "Website Optimisation",
  "Keyword Research",
  "Competitor Insights",
  "Local SEO",
  "Content Strategy",
  "Digital PR",
  "Reddit & Community Research",
  "Reviews & Reputation",
  "Authority Building",
  "Social Media",
  "Analytics",
  "AI Monitoring",
  "Business Intelligence",
];

/**
 * Brand-new-site Launch Plan mock — no demo business identity.
 * Header business name is personalised from onboarding session when available.
 */
export const newLaunchPlanMock: GrowthPlanData = {
  site: {
    family: "new",
    state: "new_pre_launch",
    flags: {
      hasWebsiteAccess: false,
      scanDepth: "none",
      siteLive: false,
    },
  },
  header: {
    businessName: "Your business",
    title: "Your Launch Plan is ready.",
    support:
      "We've researched your market and competitors, and prepared the foundations for your online growth.",
  },
  confirmations: [
    { id: "business", label: "Business understood", done: true },
    { id: "competitors", label: "Competitors analysed", done: true },
    { id: "market", label: "Market researched", done: true },
    { id: "opportunities", label: "Opportunities identified", done: true },
  ],
  keyDiscoveries: [
    {
      id: "demand",
      text: "Customers nearby are actively searching for services like yours.",
    },
    {
      id: "gaps",
      text: "Several established competitors leave gaps in clarity and local focus.",
    },
    {
      id: "structure",
      text: "A simple website structure could help you launch with confidence.",
    },
    {
      id: "community",
      text: "Community conversations reveal the questions buyers ask before they get in touch.",
    },
    {
      id: "launch",
      text: "A clear local and authority plan will support you from day one.",
    },
  ],
  growthTeam: {
    title: "Your Growth Team Is Ready",
    support:
      "Over the last few moments, RankAura has analysed your business and started preparing a personalised growth strategy designed around your goals, your customers and your market.",
    quietWork:
      "We'll quietly work through these areas while keeping you informed of the things that genuinely matter.",
    strategyLine:
      "Your business now has a complete AI-powered growth strategy covering every major area of online visibility.",
    promise:
      "You don't need to become an SEO expert. We'll continuously monitor your market and competitors, quietly preparing your launch foundations while keeping you informed about the opportunities that matter most.",
    checklist: GROWTH_TEAM_CHECKLIST,
  },
  primaryOpportunity: {
    title: "We've found a strong opportunity around local searches.",
    support:
      "We've used this research to prepare your website structure and initial content plan.",
    actionLabel: "View Strategy",
  },
  whatHappensNext: [
    "We're finalising your recommended website structure",
    "We've started prioritising launch keywords that matter most",
    "We're preparing your first pages and content plan",
    "We're building your local and authority roadmap",
  ],
  categories: [
    {
      id: "keyword_strategy",
      name: "Keyword Strategy",
      subtitle: "Focusing on the searches that matter most to your customers.",
      whyItMatters: "Helps focus growth work on searches that bring real demand.",
      businessImpact: "Guides every page toward real local demand.",
      summary:
        "We've prioritised launch keywords around the searches customers use when looking for businesses like yours.",
      status: "complete",
      count: 22,
      relevanceScore: 97,
      displayPriority: 1,
      featured: true,
      applicable: true,
      discovered:
        "We've found customers nearby search with clear service and location intent more than broad lifestyle terms.",
      completed:
        "We've built a launch keyword map covering brand, service, and local intent.",
      next: "We'll assign priority keywords to each recommended page in your structure.",
      primaryAction: "View Strategy",
    },
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines better understand your website.",
      whyItMatters: "Could help more customers discover your business.",
      businessImpact: "Sets you up for a clean, confident launch.",
      summary:
        "We've started preparing a clear foundation structure so your first site launches clean, fast, and easy to navigate.",
      status: "in_progress",
      count: 8,
      relevanceScore: 95,
      displayPriority: 2,
      featured: true,
      applicable: true,
      discovered:
        "We've identified that strong local launches start with a simple homepage, clear services, proof, and contact — not a large unfinished brochure.",
      completed:
        "We've prepared a recommended page structure and launch checklist for a calm first release.",
      next: "We'll refine page templates and readiness checks before go-live.",
      yourAction: "Confirm the recommended page list so build planning can continue.",
      primaryAction: "Approve",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      whyItMatters: "Answers questions your future customers are already asking online.",
      businessImpact: "Could answer the questions buyers ask before they enquire.",
      summary:
        "We've started preparing a content roadmap covering your services, process, and buyer questions.",
      status: "in_progress",
      count: 6,
      relevanceScore: 93,
      displayPriority: 3,
      featured: true,
      applicable: true,
      discovered:
        "We've identified that buyers want to understand your process, pricing clarity, and what a first conversation includes before they enquire.",
      completed:
        "We've outlined the first six pages and articles that answer those questions without sounding salesy.",
      next: "We'll draft homepage and services copy based on your approved structure.",
      primaryAction: "View Plan",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      whyItMatters: "Could increase enquiries from nearby customers.",
      businessImpact: "Could generate more Google Maps enquiries from day one.",
      summary:
        "We've prepared a local visibility plan for launch day, including profile setup and consistent business details.",
      status: "planned",
      count: 4,
      relevanceScore: 91,
      displayPriority: 4,
      featured: true,
      applicable: true,
      discovered:
        "We've found that local searches reward clear location signals from day one.",
      completed:
        "We've prepared a launch-day local checklist: profile setup, categories, service areas, and consistent details.",
      next: "We'll stage profile content so it can go live with your website.",
    },
    {
      id: "competitor_intelligence",
      name: "Competitor Insights",
      subtitle: "Learning where your competitors are succeeding and where opportunities exist.",
      whyItMatters: "Shows where you can stand out without copying anyone.",
      businessImpact: "Highlights gaps you can own at launch.",
      summary:
        "We've mapped competitor opportunities where established businesses leave gaps in clarity and local focus.",
      status: "complete",
      count: 5,
      relevanceScore: 88,
      displayPriority: 5,
      featured: true,
      applicable: true,
      discovered:
        "We've identified that several competitors explain services poorly. Clear process pages and local proof are open opportunities.",
      completed:
        "We've mapped relevant competitors and noted positioning gaps you can own at launch.",
      next: "We'll keep this map light until your site is live, then watch for meaningful moves.",
      primaryAction: "View Report",
    },
    {
      id: "analytics_tracking",
      name: "Understanding Your Performance",
      subtitle: "Showing what's working and where new opportunities are emerging.",
      whyItMatters: "Makes early enquiries visible without a wall of metrics.",
      summary:
        "We've started preparing a simple measurement plan so early enquiries are visible at launch.",
      status: "planned",
      relevanceScore: 84,
      displayPriority: 6,
      featured: false,
      applicable: true,
      discovered:
        "We've identified an opportunity to know which pages lead to enquiries from day one.",
      completed:
        "We've defined a minimal launch tracking set: visits, key page views, and contact actions.",
      next: "We'll prepare installation steps for launch week.",
    },
    {
      id: "authority_building",
      name: "Growing Your Authority",
      subtitle: "Building trust and credibility over time.",
      whyItMatters: "Helps customers recognise your expertise.",
      summary:
        "We've started preparing early authority work focused on trusted local mentions.",
      status: "planned",
      relevanceScore: 76,
      displayPriority: 7,
      featured: false,
      applicable: true,
      discovered:
        "We've found businesses like yours gain trust faster with consistent directory presence and clear proof than with broad outreach.",
      completed:
        "We've drafted an authority and launch preparation list prioritising quality over volume.",
      next: "We'll sequence citation and mention work for the weeks after go-live.",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from the conversations your customers are already having.",
      whyItMatters: "Surfaces real buying concerns and the language people use.",
      summary:
        "We've researched how people describe their needs, concerns, and decision process before hiring a business like yours.",
      status: "complete",
      count: 9,
      relevanceScore: 80,
      displayPriority: 8,
      featured: false,
      applicable: true,
      discovered:
        "People ask how to choose a provider, what a first conversation should include, and how to avoid surprises.\n\nThis research comes from public discussions and community trends. RankAura uses these insights to create original content that answers genuine customer questions. It does not copy discussions.",
      completed:
        "We've gathered recurring questions, objections, FAQ opportunities, and service-page ideas from public language patterns.",
      next: "We'll fold the strongest questions into your launch FAQs and key pages.",
      primaryAction: "View Report",
    },
    {
      id: "business_intelligence",
      name: "Business Intelligence",
      subtitle: "Helping you spot opportunities beyond traditional SEO.",
      whyItMatters: "Ensures every recommendation fits your business — not a generic template.",
      summary:
        "We've captured your positioning so the launch plan stays personal to your business.",
      status: "complete",
      relevanceScore: 72,
      displayPriority: 9,
      featured: false,
      applicable: true,
      discovered:
        "We've captured audience, services, and market priorities to guide the launch plan.",
      completed:
        "We've built a clear picture of your business so RankAura recommendations stay aligned.",
      next: "We'll refresh this picture once your first projects are live online.",
    },
    {
      id: "reviews_reputation",
      name: "Reviews & Reputation",
      subtitle: "Helping customers feel confident choosing your business.",
      whyItMatters: "Builds trust before customers contact you.",
      summary:
        "We've prepared a reputation plan for after your first customers — not forced before launch.",
      status: "planned",
      relevanceScore: 55,
      displayPriority: 10,
      featured: false,
      applicable: true,
      discovered:
        "We've identified that new businesses benefit from collecting early feedback in a calm, consistent way.",
      completed:
        "We've outlined a post-launch review invitation approach for your first completed jobs.",
      next: "We'll activate this once you have customers ready to share feedback.",
    },
    {
      id: "ai_monitoring",
      name: "Ongoing Monitoring",
      subtitle: "Keeping a quiet watch so nothing important is missed.",
      whyItMatters: "Surfaces only the changes that deserve your attention.",
      summary:
        "We've defined which signals will matter once your site is live.",
      status: "planned",
      relevanceScore: 50,
      displayPriority: 11,
      featured: false,
      applicable: true,
      discovered:
        "Pre-launch, the priority is preparation — not noisy alerts.",
      completed:
        "We've prepared monitoring rules ready for launch.",
      next: "Monitoring switches on at launch with a calm alert threshold.",
    },
    {
      id: "digital_pr",
      name: "Digital PR",
      subtitle: "Building recognition beyond your own website.",
      whyItMatters: "Builds awareness beyond your own website.",
      summary:
        "We've noted soft launch angles for later; foundations come first.",
      status: "planned",
      relevanceScore: 40,
      displayPriority: 12,
      featured: false,
      applicable: true,
      discovered:
        "We've found features favour businesses with finished proof and a clear point of view.",
      completed:
        "We've noted soft launch angles to revisit after your first case studies exist.",
      next: "We'll hold PR until the site and key pages are ready.",
    },
    {
      id: "social_media",
      name: "Social Media",
      subtitle: "Supporting trust without becoming a full-time posting job.",
      whyItMatters: "Reinforces your website when it helps — never for vanity metrics.",
      summary:
        "We've parked a light post-launch social outline so focus stays on launch foundations.",
      status: "planned",
      relevanceScore: 36,
      displayPriority: 13,
      featured: false,
      applicable: true,
      discovered:
        "We've found search and clarity usually drive early enquiries more than daily posting.",
      completed:
        "We've prepared a light post-launch social support outline.",
      next: "We'll suggest posts only after core pages are live.",
    },
  ],
  finalReassurance: {
    title: "You're in good hands.",
    support:
      "Your Growth Plan will continue to evolve as your business grows. RankAura monitors your market, competitors, customer behaviour and trends around the clock, surfacing new opportunities as they appear and quietly working through improvements behind the scenes.",
    closing:
      "Your business keeps moving forward—even when you're busy doing everything else.",
  },
};
