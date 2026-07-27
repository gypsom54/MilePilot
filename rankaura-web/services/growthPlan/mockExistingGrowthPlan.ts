import type { GrowthPlanData } from "@/types/growthPlan";

/**
 * Deterministic existing-site Growth Plan mock — polished premium copy.
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
  primaryOpportunity: {
    title: "Your service pages could better match how local customers search.",
    support:
      "A few calm improvements here could help more people discover your practice.",
    actionLabel: "Review & Fix",
  },
  whatHappensNext: [
    "Prioritising your highest-impact improvements",
    "Preparing safe recommendations for your review",
    "Building your first content roadmap",
    "Monitoring competitors automatically",
  ],
  categories: [
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines understand your website.",
      whyItMatters: "Could help more customers discover your website.",
      businessImpact: "Could improve local visibility.",
      summary:
        "A few page improvements could make your services easier to find on mobile and in local search.",
      status: "waiting_for_approval",
      count: 4,
      relevanceScore: 96,
      displayPriority: 1,
      featured: true,
      applicable: true,
      discovered:
        "Your hypnotherapy and anxiety pages could use clearer Portsmouth-area language people already search for. Two pages could also feel quicker on a phone.",
      completed:
        "We prepared a calm set of heading and copy recommendations, plus a short list of mobile improvements ready for your review.",
      next: "Once you approve, we'll apply the updates and check how the site feels on mobile.",
      yourAction: "Review the recommended page improvements and approve the ones you're comfortable with.",
      primaryAction: "Review & Fix",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      whyItMatters: "Could improve your visibility on Google Maps.",
      businessImpact: "Could generate more Google Maps enquiries.",
      summary:
        "Your Google Business Profile is active — with a few refinements it could attract more nearby clients.",
      status: "in_progress",
      count: 3,
      relevanceScore: 94,
      displayPriority: 2,
      featured: true,
      applicable: true,
      discovered:
        "Nearby clinics with clearer Portsmouth and Southsea coverage appear ahead for several local therapy searches — an opportunity for you to catch up calmly.",
      completed:
        "We mapped your service areas and drafted clearer category and description language for your profile.",
      next: "We'll refine local listings and keep your website contact details consistent with your profile.",
      yourAction: "Confirm your primary service areas so we can update your profile accurately.",
      primaryAction: "Review",
    },
    {
      id: "reviews_reputation",
      name: "Reviews & Reputation",
      subtitle: "Helping customers choose your business.",
      whyItMatters: "Improves confidence before customers contact you.",
      businessImpact: "Could increase customer trust.",
      summary:
        "Your recent reviews are strong. A gentle system for inviting new feedback could help even more.",
      status: "planned",
      count: 2,
      relevanceScore: 90,
      displayPriority: 3,
      featured: true,
      applicable: true,
      discovered:
        "Clients who leave reviews mention calm sessions and clear explanations — language worth reinforcing. There's room to grow review volume alongside nearby competitors.",
      completed:
        "We drafted a short, respectful review invitation you can send after sessions.",
      next: "We'll set a gentle reminder rhythm and keep an eye on reputation.",
      primaryAction: "View Plan",
    },
    {
      id: "keyword_strategy",
      name: "Keyword Strategy",
      subtitle: "Focusing on searches that matter most.",
      whyItMatters: "Helps focus on searches that matter most.",
      businessImpact: "Points growth work at real customer demand.",
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
      next: "We'll weave these phrases into your service pages and upcoming articles.",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      whyItMatters: "Answers questions customers are already asking.",
      businessImpact: "Could answer 18 customer questions.",
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
      next: "We'll draft the first two pieces for your approval before publishing.",
      yourAction: "Approve the first article topics so drafting can begin.",
      primaryAction: "Approve",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from conversations your customers are already having.",
      whyItMatters: "Surfaces the real language and concerns people use before they book.",
      summary:
        "We discovered recurring customer questions and concerns that your current content doesn't answer yet.",
      status: "complete",
      count: 7,
      relevanceScore: 82,
      displayPriority: 6,
      featured: false,
      applicable: true,
      discovered:
        "In public discussions, people often ask whether hypnotherapy feels ‘weird’, how it differs from counselling, and what to expect if they are nervous. Natural phrases include ‘does hypnotherapy work for anxiety’ and ‘what happens in a first session’.\n\nThis research comes from public discussions and community trends. RankAura uses these insights to create original content that answers genuine customer questions. It does not copy discussions.",
      completed:
        "We captured recurring questions, common buying concerns, and content opportunities based on real language patterns.",
      next: "We'll turn the strongest questions into FAQ blocks and blog outlines that sound like your practice.",
      primaryAction: "View Report",
    },
    {
      id: "competitor_intelligence",
      name: "Competitor Insights",
      subtitle: "Understanding how similar businesses show up online.",
      whyItMatters: "Shows where you can stand out without copying anyone.",
      summary:
        "Three nearby practices lead local search — mainly with clearer service pages, not better care.",
      status: "monitoring",
      count: 3,
      relevanceScore: 78,
      displayPriority: 7,
      featured: false,
      applicable: true,
      discovered:
        "Competitors win visibility with plain service pages, visible reviews, and consistent Portsmouth naming — opportunities you can match calmly.",
      completed:
        "We documented who appears for your priority searches and where your pages can close the gap.",
      next: "We'll watch for meaningful changes and only surface what matters to you.",
    },
    {
      id: "analytics_tracking",
      name: "Understanding Your Performance",
      subtitle: "Showing what's working and where opportunities exist.",
      whyItMatters: "Makes progress visible without drowning you in numbers.",
      summary:
        "Basic analytics are in place. A few clearer booking signals would make wins easier to see.",
      status: "planned",
      relevanceScore: 70,
      displayPriority: 8,
      featured: false,
      applicable: true,
      discovered:
        "Page views are tracked, but enquiry and booking clicks are harder to see as clear outcomes.",
      completed:
        "We listed the few events that would make progress visible without creating a complex dashboard.",
      next: "We'll prepare a simple tracking setup for you to approve when ready.",
    },
    {
      id: "authority_building",
      name: "Growing Your Authority",
      subtitle: "Building long-term trust online.",
      whyItMatters: "Helps Google and customers recognise your expertise over time.",
      summary:
        "Local mentions exist already. A short plan could make them more consistent and trusted.",
      status: "planned",
      relevanceScore: 64,
      displayPriority: 9,
      featured: false,
      applicable: true,
      discovered:
        "A handful of local listings mention your practice, with room to make them clearer and more consistent.",
      completed:
        "We inventoried current mentions and noted which ones are worth improving first.",
      next: "We'll prepare a short authority plan focused on trusted local sources.",
    },
    {
      id: "ai_monitoring",
      name: "Ongoing Monitoring",
      subtitle: "Keeping a quiet watch so nothing important is missed.",
      whyItMatters: "Surfaces only the changes that deserve your attention.",
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
        "Monitoring is in place for material ranking or reputation changes.",
      next: "We'll surface only changes that deserve your attention.",
    },
    {
      id: "business_intelligence",
      name: "Understanding Your Business",
      subtitle: "Keeping RankAura aligned with how you actually work.",
      whyItMatters: "Ensures every recommendation fits your practice — not a generic template.",
      summary:
        "We understand your focus: calm, practical hypnotherapy for anxiety, habits, and confidence.",
      status: "complete",
      relevanceScore: 58,
      displayPriority: 11,
      featured: false,
      applicable: true,
      discovered:
        "Your strongest story is a reassuring, professional Portsmouth practice — not a generic wellness brand.",
      completed:
        "We captured positioning, services, and audience priorities to guide every growth decision.",
      next: "We'll keep this picture updated as your services evolve.",
    },
    {
      id: "digital_pr",
      name: "Digital PR",
      subtitle: "Building recognition beyond your own website.",
      whyItMatters: "Builds trust and authority over time.",
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
      next: "We'll revisit this once service-page and review foundations are in place.",
    },
    {
      id: "social_media",
      name: "Social Media",
      subtitle: "Supporting trust without becoming a full-time posting job.",
      whyItMatters: "Reinforces your website when it helps — never for vanity metrics.",
      summary:
        "Social can support trust, but it isn't the main growth lever for this practice right now.",
      status: "planned",
      relevanceScore: 38,
      displayPriority: 13,
      featured: false,
      applicable: true,
      discovered:
        "Your audience discovers you mainly through search and recommendations, not daily social scrolling.",
      completed:
        "We parked a light social support plan so it doesn't distract from higher-value work.",
      next: "We'll suggest only occasional posts that reinforce your website content.",
    },
  ],
};
