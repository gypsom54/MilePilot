import type { GrowthPlanData } from "@/types/growthPlan";

/**
 * Deterministic brand-new-site Launch Plan mock — polished premium copy.
 * Credible pre-launch local commercial business — Harbour & Oak Interiors.
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
    businessName: "Harbour & Oak Interiors",
    title: "Here's how we'll help grow your business.",
    support:
      "We've researched your market and competitors, and prepared the foundations for your online growth. Meaningful work is already underway.",
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
      text: "Customers nearby are actively searching for interior design and renovation help.",
    },
    {
      id: "gaps",
      text: "Several established studios leave gaps in clarity and local focus.",
    },
    {
      id: "structure",
      text: "A simple website structure could help you launch with confidence.",
    },
    {
      id: "community",
      text: "Community conversations reveal the exact questions buyers ask before hiring a designer.",
    },
    {
      id: "launch",
      text: "A clear local and authority plan will support you from day one.",
    },
  ],
  primaryOpportunity: {
    title: "We found a strong opportunity around local commercial searches.",
    support:
      "We've used this research to prepare your website structure and initial content plan.",
    actionLabel: "View Strategy",
  },
  whatHappensNext: [
    "Finalising your recommended website structure",
    "Prioritising launch keywords that matter most",
    "Preparing your first pages and content plan",
    "Building your local and authority roadmap",
  ],
  categories: [
    {
      id: "keyword_strategy",
      name: "Keyword Strategy",
      subtitle: "Focusing on searches that matter most.",
      whyItMatters: "Helps focus on searches that matter most.",
      businessImpact: "Guides every page toward real local demand.",
      summary:
        "Launch keywords are prioritised around local commercial interior design and home renovation searches.",
      status: "complete",
      count: 22,
      relevanceScore: 97,
      displayPriority: 1,
      featured: true,
      applicable: true,
      discovered:
        "People nearby search for interior designers, kitchen renovation ideas, and commercial fit-out partners more than broad lifestyle terms.",
      completed:
        "We built a launch keyword map covering brand, service, and local commercial intent.",
      next: "We'll assign priority keywords to each recommended page in your structure.",
      primaryAction: "View Strategy",
    },
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines understand your website.",
      whyItMatters: "Could help more customers discover your website.",
      businessImpact: "Sets you up for a clean, confident launch.",
      summary:
        "A clear foundation structure is ready so your first site launches clean, fast, and easy to navigate.",
      status: "in_progress",
      count: 8,
      relevanceScore: 95,
      displayPriority: 2,
      featured: true,
      applicable: true,
      discovered:
        "Successful local studios launch with a simple homepage, clear services, project proof, and contact — not a large unfinished brochure.",
      completed:
        "We prepared a recommended page structure and technical launch checklist for a calm first release.",
      next: "We'll refine page templates and readiness checks before go-live.",
      yourAction: "Confirm the recommended page list so build planning can continue.",
      primaryAction: "Approve",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      whyItMatters: "Answers questions customers are already asking.",
      businessImpact: "Could answer the questions buyers ask before they enquire.",
      summary:
        "An initial content roadmap covers your services, process, and the questions buyers ask before hiring a designer.",
      status: "in_progress",
      count: 6,
      relevanceScore: 93,
      displayPriority: 3,
      featured: true,
      applicable: true,
      discovered:
        "Buyers want to understand your process, budget ranges, and what a first consultation includes before they enquire.",
      completed:
        "We outlined the first six pages and articles that answer those questions without sounding salesy.",
      next: "We'll draft homepage and services copy based on your approved structure.",
      primaryAction: "View Plan",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      whyItMatters: "Could improve your visibility on Google Maps.",
      businessImpact: "Could generate more Google Maps enquiries from day one.",
      summary:
        "A local visibility plan is ready for launch day, including profile setup and consistent business details.",
      status: "planned",
      count: 4,
      relevanceScore: 91,
      displayPriority: 4,
      featured: true,
      applicable: true,
      discovered:
        "Local commercial and residential design searches reward clear location signals from day one.",
      completed:
        "We prepared a launch-day local checklist: profile setup, categories, service areas, and consistent details.",
      next: "We'll stage profile content so it can go live with your website.",
    },
    {
      id: "competitor_intelligence",
      name: "Competitor Insights",
      subtitle: "Understanding how similar businesses show up online.",
      whyItMatters: "Shows where you can stand out without copying anyone.",
      businessImpact: "Highlights gaps you can own at launch.",
      summary:
        "Competitor opportunities show where established studios leave gaps in clarity and local focus.",
      status: "complete",
      count: 5,
      relevanceScore: 88,
      displayPriority: 5,
      featured: true,
      applicable: true,
      discovered:
        "Several studios rank well but explain services poorly. Clear process pages and local project stories are open opportunities.",
      completed:
        "We mapped five relevant competitors and noted positioning gaps you can own at launch.",
      next: "We'll keep this map light until your site is live, then watch for meaningful moves.",
      primaryAction: "View Report",
    },
    {
      id: "analytics_tracking",
      name: "Understanding Your Performance",
      subtitle: "Showing what's working and where opportunities exist.",
      whyItMatters: "Makes early enquiries visible without a wall of metrics.",
      summary:
        "A simple measurement plan will be ready before launch so early enquiries are visible.",
      status: "planned",
      relevanceScore: 84,
      displayPriority: 6,
      featured: false,
      applicable: true,
      discovered:
        "New sites often launch without knowing which pages lead to enquiries.",
      completed:
        "We defined a minimal launch tracking set: visits, key page views, and contact actions.",
      next: "We'll prepare installation steps for launch week.",
    },
    {
      id: "authority_building",
      name: "Growing Your Authority",
      subtitle: "Building long-term trust online.",
      whyItMatters: "Helps Google recognise your expertise.",
      summary:
        "Early authority work focuses on trusted local mentions and launch-ready citations.",
      status: "planned",
      relevanceScore: 76,
      displayPriority: 7,
      featured: false,
      applicable: true,
      discovered:
        "Local design businesses gain trust faster with consistent directory presence and project showcases than with broad outreach.",
      completed:
        "We drafted an authority and launch preparation list prioritising quality over volume.",
      next: "We'll sequence citation and mention work for the weeks after go-live.",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from conversations your customers are already having.",
      whyItMatters: "Surfaces real buying concerns and the language people use.",
      summary:
        "Community conversations reveal how homeowners describe renovation stress, budgets, and designer selection.",
      status: "complete",
      count: 9,
      relevanceScore: 80,
      displayPriority: 8,
      featured: false,
      applicable: true,
      discovered:
        "People ask how to choose a designer, what a consultation should include, and how to avoid surprise costs. Natural phrases include ‘interior designer near me worth it’ and ‘how much should a kitchen redesign cost’.\n\nThis research comes from public discussions and community trends. RankAura uses these insights to create original content that answers genuine customer questions. It does not copy discussions.",
      completed:
        "We gathered recurring questions, objections, FAQ opportunities, and service-page ideas from public language patterns.",
      next: "We'll fold the strongest questions into your launch FAQs and consultation page.",
      primaryAction: "View Report",
    },
    {
      id: "business_intelligence",
      name: "Understanding Your Business",
      subtitle: "Keeping RankAura aligned with how you actually work.",
      whyItMatters: "Ensures every recommendation fits your studio — not a generic template.",
      summary:
        "Your positioning is clear: thoughtful interior design for homes and small commercial spaces by the harbour.",
      status: "complete",
      relevanceScore: 72,
      displayPriority: 9,
      featured: false,
      applicable: true,
      discovered:
        "Your offer sits between pure residential styling and full commercial fit-out — a niche with room to speak plainly.",
      completed:
        "We captured audience, services, and market priorities to guide the launch plan.",
      next: "We'll refresh this picture once your first projects are live online.",
    },
    {
      id: "reviews_reputation",
      name: "Reviews & Reputation",
      subtitle: "Helping customers choose your business.",
      whyItMatters: "Improves confidence before customers contact you.",
      summary:
        "A reputation plan is prepared for after your first clients — not forced before launch.",
      status: "planned",
      relevanceScore: 55,
      displayPriority: 10,
      featured: false,
      applicable: true,
      discovered:
        "New studios benefit from collecting early project feedback in a calm, consistent way.",
      completed:
        "We outlined a post-launch review invitation approach for your first completed projects.",
      next: "We'll activate this once you have clients ready to share feedback.",
    },
    {
      id: "ai_monitoring",
      name: "Ongoing Monitoring",
      subtitle: "Keeping a quiet watch so nothing important is missed.",
      whyItMatters: "Surfaces only the changes that deserve your attention.",
      summary:
        "Monitoring will begin lightly at launch for keyword and competitor movement.",
      status: "planned",
      relevanceScore: 50,
      displayPriority: 11,
      featured: false,
      applicable: true,
      discovered:
        "Pre-launch, the priority is preparation — not noisy alerts.",
      completed:
        "We defined which signals will matter once your site is live.",
      next: "Monitoring switches on at launch with a calm alert threshold.",
    },
    {
      id: "digital_pr",
      name: "Digital PR",
      subtitle: "Building recognition beyond your own website.",
      whyItMatters: "Builds trust and authority over time.",
      summary:
        "PR angles can support launch later; foundations come first.",
      status: "planned",
      relevanceScore: 40,
      displayPriority: 12,
      featured: false,
      applicable: true,
      discovered:
        "Local design features favour studios with finished project stories and a clear point of view.",
      completed:
        "We noted soft launch angles to revisit after your first case studies exist.",
      next: "Hold PR until the site and project pages are ready.",
    },
    {
      id: "social_media",
      name: "Social Media",
      subtitle: "Supporting trust without becoming a full-time posting job.",
      whyItMatters: "Reinforces your website when it helps — never for vanity metrics.",
      summary:
        "Social can showcase projects later; it is support, not the launch foundation.",
      status: "planned",
      relevanceScore: 36,
      displayPriority: 13,
      featured: false,
      applicable: true,
      discovered:
        "Visual work will eventually thrive on social, but search and clarity drive early enquiries.",
      completed:
        "We parked a light post-launch social support outline.",
      next: "Suggest project posts only after core pages are live.",
    },
  ],
};
