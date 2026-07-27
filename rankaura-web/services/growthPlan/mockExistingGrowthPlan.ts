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
 * Deterministic existing-site Growth Plan mock — confidence & reassurance polish.
 * Local service business with a live website — Portsmouth Hypnotherapy.
 */
export const existingGrowthPlanMock: GrowthPlanData = {
  site: {
    family: "existing",
    state: "existing",
    flags: {
      hasWebsiteAccess: true,
      scanDepth: "full",
      siteLive: true,
    },
  },
  header: {
    businessName: "Portsmouth Hypnotherapy",
    title: "We've already identified opportunities to help your business grow.",
    support:
      "We've analysed your website, competitors and market to understand where your biggest opportunities are. Here's what we discovered.",
  },
  confirmations: [
    { id: "business", label: "Business understood", done: true },
    { id: "website", label: "Website analysed", done: true },
    { id: "competitors", label: "Competitors analysed", done: true },
    { id: "market", label: "Market researched", done: true },
    { id: "opportunities", label: "Opportunities identified", done: true },
  ],
  keyDiscoveries: [
    {
      id: "search",
      text: "Customers are actively searching for the services you offer.",
    },
    {
      id: "competitors",
      text: "Several competitors are missing content your clients already want.",
    },
    {
      id: "gbp",
      text: "Your Google Business Profile could attract more local enquiries.",
    },
    {
      id: "community",
      text: "Local online discussions revealed customer questions your website doesn't answer yet.",
    },
    {
      id: "visibility",
      text: "Clear opportunities exist to improve how people find and trust you online.",
    },
  ],
  growthTeam: {
    title: "Your Growth Team Is Ready",
    support:
      "Over the last few moments, RankAura has analysed your business and started preparing a personalised growth strategy designed around your goals, your customers and your market.",
    quietWork:
      "We'll quietly work through these areas while keeping you informed of the things that genuinely matter.",
    strategyLine:
      "Your personalised growth strategy currently includes 13 active growth areas.",
    promise:
      "You don't need to become an SEO expert. We'll continuously monitor your website, competitors and market, quietly working through improvements while keeping you informed about the opportunities that matter most.",
    checklist: GROWTH_TEAM_CHECKLIST,
  },
  primaryOpportunity: {
    title: "We've started preparing improvements for your service pages.",
    support:
      "A few calm recommendations could help more local customers discover your practice.",
    actionLabel: "Review & Fix",
  },
  whatHappensNext: [
    "We've started prioritising your highest-impact improvements",
    "We're preparing safe recommendations for your review",
    "We're building your first content roadmap",
    "We're already monitoring competitors automatically",
  ],
  categories: [
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines better understand your website.",
      whyItMatters: "Could help more customers discover your business.",
      businessImpact: "Could help more customers discover your business.",
      summary:
        "We've prepared a few page improvements so your services are easier to find on mobile and in local search.",
      status: "waiting_for_approval",
      count: 4,
      relevanceScore: 96,
      displayPriority: 1,
      featured: true,
      applicable: true,
      discovered:
        "We've identified opportunities to use clearer Portsmouth-area language on your hypnotherapy and anxiety pages — phrases people already search for. Two pages could also feel quicker on a phone.",
      completed:
        "We've prepared a calm set of heading and copy recommendations, plus a short list of mobile improvements ready for your review.",
      next: "Once you approve, we'll apply the updates and check how the site feels on mobile.",
      yourAction: "Review the recommended page improvements and approve the ones you're comfortable with.",
      primaryAction: "Review & Fix",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      whyItMatters: "Could increase enquiries from nearby customers.",
      businessImpact: "Could increase enquiries from nearby customers.",
      summary:
        "We've started refining your Google Business Profile so more nearby clients can find you.",
      status: "in_progress",
      count: 3,
      relevanceScore: 94,
      displayPriority: 2,
      featured: true,
      applicable: true,
      discovered:
        "We've identified an opportunity to catch up with nearby clinics that present clearer Portsmouth and Southsea coverage for local therapy searches.",
      completed:
        "We've mapped your service areas and drafted clearer category and description language for your profile.",
      next: "We'll refine local listings and keep your website contact details consistent with your profile.",
      yourAction: "Confirm your primary service areas so we can update your profile accurately.",
      primaryAction: "Review",
    },
    {
      id: "reviews_reputation",
      name: "Reviews & Reputation",
      subtitle: "Helping customers feel confident choosing your business.",
      whyItMatters: "Builds trust before customers contact you.",
      businessImpact: "Builds trust before customers contact you.",
      summary:
        "Your recent reviews are strong. We've prepared a gentle system for inviting new feedback.",
      status: "planned",
      count: 2,
      relevanceScore: 90,
      displayPriority: 3,
      featured: true,
      applicable: true,
      discovered:
        "Clients who leave reviews mention calm sessions and clear explanations — language worth reinforcing. There's a clear opportunity to grow review volume alongside nearby competitors.",
      completed:
        "We've drafted a short, respectful review invitation you can send after sessions.",
      next: "We'll set a gentle reminder rhythm and keep an eye on reputation.",
      primaryAction: "View Plan",
    },
    {
      id: "keyword_strategy",
      name: "Keyword Strategy",
      subtitle: "Focusing on the searches that matter most to your customers.",
      whyItMatters: "Helps focus growth work on searches that bring real demand.",
      businessImpact: "Points growth work at real customer demand.",
      summary:
        "We've identified the phrases local clients use when looking for hypnotherapy and anxiety support.",
      status: "complete",
      count: 18,
      relevanceScore: 88,
      displayPriority: 4,
      featured: true,
      applicable: true,
      discovered:
        "We've found people search for anxiety hypnotherapy, stop smoking hypnosis, and Portsmouth hypnotherapist more often than the broader wellness terms on your site.",
      completed:
        "We've built a priority phrase list grouped by intent: find a therapist, understand treatment, and book a session.",
      next: "We'll weave these phrases into your service pages and upcoming articles.",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      whyItMatters: "Answers questions your future customers are already asking online.",
      businessImpact: "Could answer 18 customer questions.",
      summary:
        "We've started preparing a content roadmap focused on the questions clients ask before booking.",
      status: "in_progress",
      count: 5,
      relevanceScore: 86,
      displayPriority: 5,
      featured: true,
      applicable: true,
      discovered:
        "We've identified that prospective clients want clear answers about what a first session feels like, how many sessions are typical, and whether hypnotherapy can help with sleep and confidence.",
      completed:
        "We've prepared five article and FAQ outlines that match those questions.",
      next: "We'll draft the first two pieces for your approval before publishing.",
      yourAction: "Approve the first article topics so drafting can begin.",
      primaryAction: "Approve",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from the conversations your customers are already having.",
      whyItMatters: "Surfaces the real language and concerns people use before they book.",
      summary:
        "We've discovered recurring customer questions and concerns that your current content doesn't answer yet.",
      status: "complete",
      count: 7,
      relevanceScore: 82,
      displayPriority: 6,
      featured: false,
      applicable: true,
      discovered:
        "In public discussions, people often ask whether hypnotherapy feels ‘weird’, how it differs from counselling, and what to expect if they are nervous. Natural phrases include ‘does hypnotherapy work for anxiety’ and ‘what happens in a first session’.\n\nThis research comes from public discussions and community trends. RankAura uses these insights to create original content that answers genuine customer questions. It does not copy discussions.",
      completed:
        "We've captured recurring questions, common buying concerns, and content opportunities based on real language patterns.",
      next: "We'll turn the strongest questions into FAQ blocks and blog outlines that sound like your practice.",
      primaryAction: "View Report",
    },
    {
      id: "competitor_intelligence",
      name: "Competitor Insights",
      subtitle: "Learning where your competitors are succeeding and where opportunities exist.",
      whyItMatters: "Shows where you can stand out without copying anyone.",
      summary:
        "We're already monitoring three nearby practices — and we've found clear opportunities in how they present their services.",
      status: "monitoring",
      count: 3,
      relevanceScore: 78,
      displayPriority: 7,
      featured: false,
      applicable: true,
      discovered:
        "We've identified that competitors win visibility with plain service pages, visible reviews, and consistent Portsmouth naming — opportunities you can match calmly.",
      completed:
        "We've documented who appears for your priority searches and where your pages can close the gap.",
      next: "We're continuously watching for meaningful changes and will only surface what matters to you.",
    },
    {
      id: "analytics_tracking",
      name: "Understanding Your Performance",
      subtitle: "Showing what's working and where new opportunities are emerging.",
      whyItMatters: "Makes progress visible without drowning you in numbers.",
      summary:
        "We've started preparing clearer booking signals so wins are easier to see.",
      status: "planned",
      relevanceScore: 70,
      displayPriority: 8,
      featured: false,
      applicable: true,
      discovered:
        "We've identified an opportunity to make enquiry and booking clicks clearer as outcomes — beyond page views alone.",
      completed:
        "We've listed the few events that would make progress visible without creating a complex dashboard.",
      next: "We'll prepare a simple tracking setup for you to approve when ready.",
    },
    {
      id: "authority_building",
      name: "Growing Your Authority",
      subtitle: "Building trust and credibility over time.",
      whyItMatters: "Helps customers and Google recognise your expertise over time.",
      summary:
        "We've started preparing a short plan to make your local mentions more consistent and trusted.",
      status: "planned",
      relevanceScore: 64,
      displayPriority: 9,
      featured: false,
      applicable: true,
      discovered:
        "We've found local listings that mention your practice, with clear opportunities to make them clearer and more consistent.",
      completed:
        "We've inventoried current mentions and noted which ones are worth improving first.",
      next: "We'll prepare a short authority plan focused on trusted local sources.",
    },
    {
      id: "ai_monitoring",
      name: "Ongoing Monitoring",
      subtitle: "Keeping a quiet watch so nothing important is missed.",
      whyItMatters: "Surfaces only the changes that deserve your attention.",
      summary:
        "We're already watching for ranking shifts, review changes, and competitor moves.",
      status: "monitoring",
      relevanceScore: 60,
      displayPriority: 10,
      featured: false,
      applicable: true,
      discovered:
        "We've noted your market is steady, with occasional spikes around anxiety and sleep searches in colder months.",
      completed:
        "Monitoring is in place for material ranking or reputation changes.",
      next: "We'll surface only changes that deserve your attention.",
    },
    {
      id: "business_intelligence",
      name: "Business Intelligence",
      subtitle: "Helping you spot opportunities beyond traditional SEO.",
      whyItMatters: "Ensures every recommendation fits your practice — not a generic template.",
      summary:
        "We understand your focus: calm, practical hypnotherapy for anxiety, habits, and confidence.",
      status: "complete",
      relevanceScore: 58,
      displayPriority: 11,
      featured: false,
      applicable: true,
      discovered:
        "We've captured that your strongest story is a reassuring, professional Portsmouth practice — not a generic wellness brand.",
      completed:
        "We've captured positioning, services, and audience priorities to guide every growth decision.",
      next: "We'll keep this picture updated as your services evolve.",
    },
    {
      id: "digital_pr",
      name: "Digital PR",
      subtitle: "Building recognition beyond your own website.",
      whyItMatters: "Builds awareness beyond your own website.",
      summary:
        "We've noted soft local angles for later — foundations come first.",
      status: "planned",
      relevanceScore: 42,
      displayPriority: 12,
      featured: false,
      applicable: true,
      discovered:
        "We've identified that local lifestyle and wellbeing outlets occasionally feature therapists with clear, helpful angles.",
      completed:
        "We've noted two soft angles that could work once your core pages are stronger.",
      next: "We'll revisit this once service-page and review foundations are in place.",
    },
    {
      id: "social_media",
      name: "Social Media",
      subtitle: "Supporting trust without becoming a full-time posting job.",
      whyItMatters: "Reinforces your website when it helps — never for vanity metrics.",
      summary:
        "We've parked a light social support plan so it doesn't distract from higher-value work.",
      status: "planned",
      relevanceScore: 38,
      displayPriority: 13,
      featured: false,
      applicable: true,
      discovered:
        "We've found your audience discovers you mainly through search and recommendations, not daily social scrolling.",
      completed:
        "We've prepared a light social support outline for later.",
      next: "We'll suggest only occasional posts that reinforce your website content.",
    },
  ],
  finalReassurance: {
    title: "You're in good hands.",
    support:
      "Your Growth Plan will continue to evolve as your business grows. RankAura monitors your website, competitors, customer behaviour and market trends around the clock, surfacing new opportunities as they appear and quietly working through improvements behind the scenes.",
    closing:
      "We'll keep doing the hard work, so you can focus on running your business.",
  },
};
