import type { GrowthPlanData } from "@/types/growthPlan";

/**
 * Deterministic existing-site Growth Plan mock.
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
    title: "Your Growth Plan is Ready",
    support:
      "We analysed your business, website, market and competitors. Here is what we discovered and what happens next.",
  },
  confirmations: [
    { id: "business", label: "Business understood", done: true },
    { id: "website", label: "Website analysed", done: true },
    { id: "competitors", label: "Competitors analysed", done: true },
    { id: "market", label: "Market researched", done: true },
    { id: "opportunities", label: "Opportunities identified", done: true },
  ],
  primaryOpportunity: {
    title: "Your service pages are missing valuable local search terms.",
    support:
      "Improving these pages could help more customers discover your business.",
    actionLabel: "Review & Fix",
  },
  whatHappensNext: [
    "Prioritising the most valuable website improvements",
    "Preparing safe fixes for review",
    "Building the first content roadmap",
    "Monitoring competitors and rankings",
  ],
  categories: [
    {
      id: "website_health",
      name: "Website Health",
      summary:
        "A few service pages load slowly on mobile and some headings do not match what local customers search for.",
      status: "waiting_for_approval",
      count: 4,
      relevanceScore: 96,
      displayPriority: 1,
      featured: true,
      applicable: true,
      discovered:
        "Your hypnotherapy and anxiety pages omit clear Portsmouth-area phrases people actually search. Two pages also take longer than they should on a phone.",
      completed:
        "We prepared a safe set of heading and copy improvements, plus a short list of mobile speed fixes ready for your review.",
      next: "Once you approve, we will apply the page updates and re-check how the site presents on mobile.",
      yourAction: "Review the proposed page fixes and approve the ones you are comfortable with.",
      primaryAction: "Review & Fix",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      summary:
        "Your Google Business Profile is active, but service areas and categories could better match how people search nearby.",
      status: "in_progress",
      count: 3,
      relevanceScore: 94,
      displayPriority: 2,
      featured: true,
      applicable: true,
      discovered:
        "Nearby clinics with clearer Portsmouth and Southsea coverage are appearing ahead of you for several local therapy searches.",
      completed:
        "We mapped your service areas and drafted clearer category and description language for your profile.",
      next: "We will refine local citations and align your website contact details with your profile.",
      yourAction: "Confirm your primary service areas so we can update your profile accurately.",
      primaryAction: "Review",
    },
    {
      id: "reviews_reputation",
      name: "Reviews & Reputation",
      summary:
        "Recent reviews are strong, but there is no calm system for inviting new clients to leave feedback.",
      status: "planned",
      count: 2,
      relevanceScore: 90,
      displayPriority: 3,
      featured: true,
      applicable: true,
      discovered:
        "Clients who leave reviews mention calm sessions and clear explanations — language we can reinforce. Review volume is lower than nearby competitors.",
      completed:
        "We drafted a short, respectful review invitation message you can send after sessions.",
      next: "We will set a gentle reminder rhythm and watch for any reputation risks.",
      yourAction: undefined,
      primaryAction: "View Plan",
    },
    {
      id: "keyword_strategy",
      name: "Keyword Strategy",
      summary:
        "We identified the phrases local clients use when looking for hypnotherapy and anxiety support.",
      status: "complete",
      count: 18,
      relevanceScore: 88,
      displayPriority: 4,
      featured: true,
      applicable: true,
      discovered:
        "People search for anxiety hypnotherapy, stop smoking hypnosis, and Portsmouth hypnotherapist more often than the broader wellness terms on your site.",
      completed:
        "We built a priority phrase list grouped by intent: find a therapist, understand treatment, and book a session.",
      next: "We will weave these phrases into your service pages and upcoming articles.",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      summary:
        "A short content roadmap is ready, focused on the questions clients ask before booking.",
      status: "in_progress",
      count: 5,
      relevanceScore: 86,
      displayPriority: 5,
      featured: true,
      applicable: true,
      discovered:
        "Prospective clients want clear answers about what a first session feels like, how many sessions are typical, and whether hypnotherapy can help with sleep and confidence.",
      completed:
        "We prepared five article and FAQ outlines that match those questions.",
      next: "We will draft the first two pieces for your approval before publishing.",
      yourAction: "Approve the first article topics so drafting can begin.",
      primaryAction: "Approve",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      summary:
        "We discovered recurring customer questions and concerns that your current content does not answer.",
      status: "complete",
      count: 7,
      relevanceScore: 82,
      displayPriority: 6,
      featured: false,
      applicable: true,
      discovered:
        "In public discussions, people often ask whether hypnotherapy feels ‘weird’, how it differs from counselling, and what to expect if they are nervous. Natural phrases include ‘does hypnotherapy work for anxiety’ and ‘what happens in a first session’.",
      completed:
        "We captured recurring questions, common objections, and content gaps — including FAQ and service-page ideas based on real language patterns. This is original research from public conversations, not copied posts.",
      next: "We will turn the strongest questions into FAQ blocks and blog outlines that sound like your practice.",
      yourAction: undefined,
      primaryAction: "View Report",
    },
    {
      id: "competitor_intelligence",
      name: "Competitor Intelligence",
      summary:
        "Three nearby practices dominate local search; their advantage is clearer service pages, not better care.",
      status: "monitoring",
      count: 3,
      relevanceScore: 78,
      displayPriority: 7,
      featured: false,
      applicable: true,
      discovered:
        "Competitors win visibility with plain service pages, visible reviews, and consistent Portsmouth naming — not with flashy design.",
      completed:
        "We documented who appears for your priority searches and where your pages can close the gap.",
      next: "We will watch for changes in their content and highlight only moves that matter to you.",
    },
    {
      id: "analytics_tracking",
      name: "Analytics & Tracking",
      summary:
        "Basic analytics are present; key booking events are not yet measured clearly.",
      status: "planned",
      relevanceScore: 70,
      displayPriority: 8,
      featured: false,
      applicable: true,
      discovered:
        "Page views are tracked, but enquiry and booking clicks are hard to see as clear outcomes.",
      completed:
        "We listed the few events that would make progress visible without creating a complex dashboard.",
      next: "We will prepare a simple tracking setup for you to approve when ready.",
    },
    {
      id: "authority_building",
      name: "Authority Building",
      summary:
        "Local directory mentions exist; there is room for calmer, more trusted citations.",
      status: "planned",
      relevanceScore: 64,
      displayPriority: 9,
      featured: false,
      applicable: true,
      discovered:
        "A handful of local listings mention your practice, but several are incomplete or inconsistent.",
      completed:
        "We inventoried current mentions and noted which ones are worth correcting first.",
      next: "We will prepare a short authority plan focused on trusted local sources.",
    },
    {
      id: "ai_monitoring",
      name: "AI Monitoring",
      summary:
        "Ongoing watch is ready for ranking shifts, review changes, and competitor moves.",
      status: "monitoring",
      relevanceScore: 60,
      displayPriority: 10,
      featured: false,
      applicable: true,
      discovered:
        "Your market is steady, with occasional spikes around anxiety and sleep searches in colder months.",
      completed:
        "Monitoring rules are in place for material ranking or reputation changes.",
      next: "We will surface only changes that deserve your attention.",
    },
    {
      id: "business_intelligence",
      name: "Business Intelligence",
      summary:
        "We understand your practice focus: calm, practical hypnotherapy for anxiety, habits, and confidence.",
      status: "complete",
      relevanceScore: 58,
      displayPriority: 11,
      featured: false,
      applicable: true,
      discovered:
        "Your strongest story is a reassuring, professional Portsmouth practice — not a generic wellness brand.",
      completed:
        "We captured positioning, services, and audience priorities to guide every growth decision.",
      next: "We will keep this picture updated as your services evolve.",
    },
    {
      id: "digital_pr",
      name: "Digital PR",
      summary:
        "Useful later for local features and expert commentary — not the first priority.",
      status: "planned",
      relevanceScore: 42,
      displayPriority: 12,
      featured: false,
      applicable: true,
      discovered:
        "Local lifestyle and wellbeing outlets occasionally feature therapists with clear, helpful angles.",
      completed:
        "We noted two soft angles that could work once your core pages are stronger.",
      next: "We will revisit PR once service-page and review foundations are in place.",
    },
    {
      id: "social_media",
      name: "Social Media",
      summary:
        "Social can support trust, but it is not the main growth lever for this practice right now.",
      status: "planned",
      relevanceScore: 38,
      displayPriority: 13,
      featured: false,
      applicable: true,
      discovered:
        "Your audience discovers you mainly through search and recommendations, not daily social scrolling.",
      completed:
        "We parked a light social support plan so it does not distract from higher-value work.",
      next: "We will suggest only occasional posts that reinforce your website content.",
    },
  ],
};
