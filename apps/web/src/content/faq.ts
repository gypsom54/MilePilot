export type FaqCategoryId =
  | "seo-basics"
  | "understanding-progress"
  | "seo-and-google-ads"
  | "local-visibility"
  | "trust-and-reputation"
  | "working-with-seo-autopilot";

export interface FaqCategory {
  id: FaqCategoryId;
  title: string;
  description: string;
}

export interface FaqArticle {
  slug: string;
  question: string;
  shortAnswer: string;
  fullExplanation: string;
  category: FaqCategoryId;
  relatedSlugs: string[];
  nextStep?: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "seo-basics",
    title: "SEO Basics",
    description: "Simple explanations of how search visibility works.",
  },
  {
    id: "understanding-progress",
    title: "Understanding Progress",
    description: "How to read early signals without panic or guesswork.",
  },
  {
    id: "seo-and-google-ads",
    title: "SEO and Google Ads",
    description: "When paid advertising helps — and when patience serves better.",
  },
  {
    id: "local-visibility",
    title: "Local Visibility",
    description: "Helping nearby customers find you on Google and Maps.",
  },
  {
    id: "trust-and-reputation",
    title: "Trust and Reputation",
    description: "Why reviews and credibility matter to customers and Google.",
  },
  {
    id: "working-with-seo-autopilot",
    title: "Working With SEO AutoPilot",
    description: "What to expect from the platform as your growth adviser.",
  },
];

export const FAQ_ARTICLES: FaqArticle[] = [
  {
    slug: "what-is-seo",
    question: "What is SEO?",
    category: "seo-basics",
    shortAnswer:
      "SEO helps people find your business through search engines such as Google.",
    fullExplanation:
      "When someone searches for a service you provide, SEO helps Google understand what your business offers, where you operate and why your website may be useful to that person.\n\nGood SEO is not about tricking Google. It is about making your business easier to understand, easier to trust and easier to discover.",
    relatedSlugs: [
      "how-does-google-decide-which-websites-to-show",
      "why-does-seo-take-time",
      "what-is-the-difference-between-seo-and-google-ads",
    ],
    nextStep: "Explore how SEO and Google Ads differ if you need enquiries sooner.",
  },
  {
    slug: "how-does-google-decide-which-websites-to-show",
    question: "How does Google decide which websites to show?",
    category: "seo-basics",
    shortAnswer:
      "Google looks for pages that appear useful, clear and trustworthy for the search.",
    fullExplanation:
      "Google considers many signals, including whether a page matches the search, whether the business seems genuine, how easy the site is to use, and how others refer to it.\n\nNo single trick decides the result. Clear information, helpful pages and a reliable website usually matter more than shortcuts.",
    relatedSlugs: ["what-is-seo", "how-does-google-decide-whether-a-website-is-trustworthy"],
  },
  {
    slug: "why-does-seo-take-time",
    question: "Why does SEO take time?",
    category: "seo-basics",
    shortAnswer:
      "Search visibility builds as Google learns about your business and as improvements accumulate.",
    fullExplanation:
      "Changes need to be published, discovered and assessed. Competitors are also improving. That is why SEO usually develops gradually rather than overnight.\n\nPatience is not a delay tactic — it is how durable visibility is earned.",
    relatedSlugs: ["how-long-does-seo-normally-take", "why-might-progress-appear-slow"],
  },
  {
    slug: "how-long-does-seo-normally-take",
    question: "How long does SEO normally take?",
    category: "seo-basics",
    shortAnswer:
      "SEO usually develops gradually rather than producing instant results.",
    fullExplanation:
      "Some technical improvements may be recognised within days or weeks, but meaningful business growth often takes several months. Competitive industries can take longer.\n\nDuring that time, progress may appear through stronger impressions, more relevant visitors, better local visibility and gradually improving rankings.\n\nSEO AutoPilot must never promise an exact ranking or guaranteed timescale.",
    relatedSlugs: ["why-does-seo-take-time", "what-happens-during-the-first-month"],
  },
  {
    slug: "can-anyone-guarantee-first-place-on-google",
    question: "Can anyone guarantee first place on Google?",
    category: "seo-basics",
    shortAnswer: "No. Honest providers do not guarantee first place.",
    fullExplanation:
      "Google’s results change with competition, location, search wording and many other factors. Anyone promising a fixed position is overselling.\n\nWhat can be promised is careful work, clear explanations and steady improvement where the evidence supports it.",
    relatedSlugs: ["how-long-does-seo-normally-take", "how-will-i-know-whether-seo-is-working"],
  },
  {
    slug: "does-seo-ever-stop",
    question: "Does SEO ever stop?",
    category: "seo-basics",
    shortAnswer:
      "SEO rarely finishes completely because search and competitors keep changing.",
    fullExplanation:
      "Once foundations are strong, the work often shifts from large fixes to careful maintenance and measured improvements.\n\nThat does not mean constant upheaval. It means staying clear, useful and trustworthy over time.",
    relatedSlugs: ["why-does-seo-take-time", "will-seo-autopilot-tell-me-when-nothing-needs-changing"],
  },
  {
    slug: "what-happens-during-the-first-month",
    question: "What happens during the first month?",
    category: "understanding-progress",
    shortAnswer:
      "The first month is usually about understanding the business and putting solid foundations in place.",
    fullExplanation:
      "Early work often includes clarifying what the business offers, checking that the website can support growth, and identifying a small number of priorities.\n\nLarge ranking jumps are not the main goal in month one. Clear direction and trustworthy foundations are.",
    relatedSlugs: ["how-long-does-seo-normally-take", "why-might-progress-appear-slow"],
  },
  {
    slug: "why-have-my-rankings-changed",
    question: "Why have my rankings changed?",
    category: "understanding-progress",
    shortAnswer:
      "Rankings move for many normal reasons, not only because something is wrong.",
    fullExplanation:
      "Competitors publish new pages, Google updates how it reads results, and your own site changes. Seasonal demand can also shift what people search for.\n\nA change is a signal to understand, not automatically a crisis. Look at trends and business outcomes alongside day-to-day movement.",
    relatedSlugs: [
      "why-might-progress-appear-slow",
      "how-will-i-know-whether-seo-is-working",
    ],
  },
  {
    slug: "why-might-progress-appear-slow",
    question: "Why might progress appear slow?",
    category: "understanding-progress",
    shortAnswer:
      "Useful SEO work often shows first as quieter signals before bigger ranking moves.",
    fullExplanation:
      "Improvements in clarity, trust and relevance can take time to be reflected in search results. Competitive markets take longer still.\n\nSlow progress is not the same as no progress. Impressions, better-matched visitors and stronger local presence can improve before rankings feel dramatic.",
    relatedSlugs: ["what-are-impressions", "why-are-traffic-and-rankings-different"],
  },
  {
    slug: "what-are-impressions",
    question: "What are impressions?",
    category: "understanding-progress",
    shortAnswer:
      "An impression means your business appeared in someone’s search results.",
    fullExplanation:
      "It does not mean they visited your website. Impressions show how often you were visible.\n\nRising impressions can be an early sign that Google is showing you more often, even before clicks increase.",
    relatedSlugs: ["what-is-website-traffic", "why-are-traffic-and-rankings-different"],
  },
  {
    slug: "what-is-website-traffic",
    question: "What is website traffic?",
    category: "understanding-progress",
    shortAnswer: "Website traffic means people visiting your website.",
    fullExplanation:
      "Not every visit is equally valuable. The goal is relevant visitors — people who are more likely to need what you offer.\n\nTraffic should be read alongside enquiries and sales, not in isolation.",
    relatedSlugs: ["what-are-impressions", "how-will-i-know-whether-seo-is-working"],
  },
  {
    slug: "why-are-traffic-and-rankings-different",
    question: "Why are traffic and rankings different?",
    category: "understanding-progress",
    shortAnswer:
      "A strong ranking does not always mean many visits, and visits can rise even when one keyword moves little.",
    fullExplanation:
      "Rankings describe position for specific searches. Traffic describes actual visits. A page can rank well for a rarely searched phrase, or attract visits from many smaller searches.\n\nBoth matter. Business results matter most.",
    relatedSlugs: ["what-are-impressions", "what-is-website-traffic"],
  },
  {
    slug: "how-will-i-know-whether-seo-is-working",
    question: "How will I know whether SEO is working?",
    category: "understanding-progress",
    shortAnswer:
      "Look for steadier visibility, more relevant visitors and clearer business enquiries over time.",
    fullExplanation:
      "Useful signs include stronger impressions, visits from the right locations or services, and enquiries that match what you sell.\n\nDay-to-day ranking noise is less important than a calm trend in the right direction.",
    relatedSlugs: ["why-might-progress-appear-slow", "why-will-i-still-receive-updates-when-rankings-have-not-changed"],
  },
  {
    slug: "what-is-the-difference-between-seo-and-google-ads",
    question: "What is the difference between SEO and Google Ads?",
    category: "seo-and-google-ads",
    shortAnswer:
      "Google Ads can place your business in front of people quickly for a cost per click. SEO builds natural visibility more slowly.",
    fullExplanation:
      "Google Ads can place your business in front of potential customers quickly, but you normally pay whenever someone clicks the advert.\n\nSEO takes longer because it builds your natural visibility over time. It can provide longer-term value, but it requires patience and consistent improvement.\n\nSome businesses benefit from using both: paid advertising for quicker traffic and SEO for sustainable long-term growth.",
    relatedSlugs: [
      "which-brings-visitors-more-quickly",
      "should-i-use-seo-google-ads-or-both",
    ],
  },
  {
    slug: "which-brings-visitors-more-quickly",
    question: "Which brings visitors more quickly?",
    category: "seo-and-google-ads",
    shortAnswer: "Paid advertising usually brings visitors sooner than SEO.",
    fullExplanation:
      "That speed is useful when you need enquiries quickly. The trade-off is ongoing cost, and traffic usually slows when spending stops.\n\nSEO is slower to start but aims to support visibility after the initial investment of effort.",
    relatedSlugs: [
      "what-happens-when-i-stop-paying-for-google-ads",
      "should-i-use-seo-google-ads-or-both",
    ],
  },
  {
    slug: "should-i-use-seo-google-ads-or-both",
    question: "Should I use SEO, Google Ads or both?",
    category: "seo-and-google-ads",
    shortAnswer:
      "It depends on your goals, budget, competition and how soon you need enquiries.",
    fullExplanation:
      "SEO suits businesses building lasting visibility. Ads can help when faster demand matters. Many owners use a balanced mix for a time.\n\nThere is no single correct answer for every business. Bigger spending is not automatically better.",
    relatedSlugs: [
      "how-should-a-small-business-divide-its-marketing-budget",
      "will-seo-autopilot-automatically-increase-my-advertising-spend",
    ],
  },
  {
    slug: "what-happens-when-i-stop-paying-for-google-ads",
    question: "What happens when I stop paying for Google Ads?",
    category: "seo-and-google-ads",
    shortAnswer: "Paid traffic normally falls away when the campaign spending stops.",
    fullExplanation:
      "Ads visibility is tied to budget. SEO visibility, by contrast, is built into your natural presence and can continue without paying per click — though it still needs care over time.",
    relatedSlugs: ["which-brings-visitors-more-quickly", "what-is-the-difference-between-seo-and-google-ads"],
  },
  {
    slug: "how-should-a-small-business-divide-its-marketing-budget",
    question: "How should a small business divide its marketing budget?",
    category: "seo-and-google-ads",
    shortAnswer:
      "Start with your goals and cash flow, then choose a mix you can sustain calmly.",
    fullExplanation:
      "If you need enquiries soon, a careful paid budget may help while SEO foundations improve. If you can be patient, more effort may go into durable organic growth.\n\nThe useful question is not “what is the biggest spend?” but “what mix matches our aims without strain?”",
    relatedSlugs: ["should-i-use-seo-google-ads-or-both", "how-will-seo-autopilot-protect-my-budget"],
  },
  {
    slug: "will-seo-autopilot-automatically-increase-my-advertising-spend",
    question: "Will SEO AutoPilot automatically increase my advertising spend?",
    category: "seo-and-google-ads",
    shortAnswer: "No. SEO AutoPilot will not raise your ad spend without your control.",
    fullExplanation:
      "Budget decisions belong to you. Guidance may sometimes recommend maintaining or even reducing spend when that better serves the business.\n\nAutomation must never remove your control over money.",
    relatedSlugs: ["how-will-seo-autopilot-protect-my-budget", "will-changes-be-made-without-my-approval"],
  },
  {
    slug: "what-is-local-seo",
    question: "What is local SEO?",
    category: "local-visibility",
    shortAnswer:
      "Local SEO helps people nearby find your business when they search in your area.",
    fullExplanation:
      "It includes clear location information, a helpful Google Business Profile, and pages that explain where you serve customers.\n\nFor many small businesses, local visibility is one of the most practical routes to enquiries.",
    relatedSlugs: ["what-is-a-google-business-profile", "why-is-appearing-on-google-maps-important"],
  },
  {
    slug: "what-is-a-google-business-profile",
    question: "What is a Google Business Profile?",
    category: "local-visibility",
    shortAnswer:
      "It is your business listing on Google Search and Maps — name, location, hours, reviews and more.",
    fullExplanation:
      "A clear, accurate profile helps customers trust that you are real and open. Photos, categories and reviews all help people choose with confidence.\n\nKeeping details up to date is simple, valuable work.",
    relatedSlugs: ["what-is-local-seo", "how-can-local-customers-find-my-business"],
  },
  {
    slug: "why-is-appearing-on-google-maps-important",
    question: "Why is appearing on Google Maps important?",
    category: "local-visibility",
    shortAnswer:
      "Many customers look for nearby options on Maps before they decide who to contact.",
    fullExplanation:
      "Maps visibility can mean phone calls, direction requests and website visits from people already intending to buy locally.\n\nIt is not the only channel that matters, but for local services it is often a major one.",
    relatedSlugs: ["what-is-a-google-business-profile", "how-can-local-customers-find-my-business"],
  },
  {
    slug: "how-can-local-customers-find-my-business",
    question: "How can local customers find my business?",
    category: "local-visibility",
    shortAnswer:
      "Through clear local search results, Maps, your website, and trusted mentions in your community.",
    fullExplanation:
      "Consistency helps: the same business name, address and phone details across your site and profile. Useful service pages and genuine reviews also help people choose you.\n\nLocal discovery is usually a combination of clarity and trust, not one clever trick.",
    relatedSlugs: ["what-is-local-seo", "why-are-customer-reviews-important"],
  },
  {
    slug: "why-are-customer-reviews-important",
    question: "Why are customer reviews important?",
    category: "trust-and-reputation",
    shortAnswer:
      "Reviews help future customers decide whether they can trust you.",
    fullExplanation:
      "People often read recent experiences before they call or book. Reviews also help Google understand that your business is active and valued.\n\nEncourage honest feedback. Do not chase volume at the expense of authenticity.",
    relatedSlugs: [
      "should-i-reply-to-every-google-review",
      "how-does-google-decide-whether-a-website-is-trustworthy",
    ],
  },
  {
    slug: "should-i-reply-to-every-google-review",
    question: "Should I reply to every Google review?",
    category: "trust-and-reputation",
    shortAnswer: "Replying thoughtfully is usually worthwhile.",
    fullExplanation:
      "A calm thank-you for positive reviews and a professional response to concerns shows that you listen. You do not need a perfect script — sincerity matters more than polish.\n\nPublic replies are part of how new customers judge you.",
    relatedSlugs: ["why-are-customer-reviews-important"],
  },
  {
    slug: "what-are-backlinks",
    question: "What are backlinks?",
    category: "trust-and-reputation",
    shortAnswer:
      "Backlinks are links from other websites that point to yours.",
    fullExplanation:
      "They can act like introductions. A relevant, trusted mention may help Google and people discover you.\n\nQuality matters far more than quantity. Forced or spammy links are not a healthy strategy.",
    relatedSlugs: ["how-does-google-decide-whether-a-website-is-trustworthy"],
  },
  {
    slug: "how-does-google-decide-whether-a-website-is-trustworthy",
    question: "How does Google decide whether a website is trustworthy?",
    category: "trust-and-reputation",
    shortAnswer:
      "Google looks for signs that a site is genuine, useful and reliable.",
    fullExplanation:
      "Clear business details, helpful content, a secure and usable website, and corroboration from others can all contribute.\n\nTrust is earned through consistency, not through dramatic claims.",
    relatedSlugs: ["what-are-backlinks", "why-are-customer-reviews-important"],
  },
  {
    slug: "what-will-seo-autopilot-do-for-my-business",
    question: "What will SEO AutoPilot do for my business?",
    category: "working-with-seo-autopilot",
    shortAnswer:
      "It aims to make online growth clearer and help you focus on the few actions that matter most.",
    fullExplanation:
      "SEO AutoPilot is designed as a trusted growth adviser: explaining what is happening, why it matters, and what to do next in plain English.\n\nIt is not here to overwhelm you with technical issue lists or to make irreversible changes without your say.",
    relatedSlugs: [
      "will-i-need-to-understand-seo",
      "will-changes-be-made-without-my-approval",
    ],
  },
  {
    slug: "will-i-need-to-understand-seo",
    question: "Will I need to understand SEO?",
    category: "working-with-seo-autopilot",
    shortAnswer: "No. You should not need to become a marketing specialist.",
    fullExplanation:
      "The product should translate complex work into calm business language. Technical detail can be available when you want it, not forced into every screen.\n\nYour job is to run the business. Ours is to make growth guidance understandable.",
    relatedSlugs: ["what-will-seo-autopilot-do-for-my-business"],
  },
  {
    slug: "will-changes-be-made-without-my-approval",
    question: "Will changes be made without my approval?",
    category: "working-with-seo-autopilot",
    shortAnswer:
      "Risky or irreversible changes should require your approval.",
    fullExplanation:
      "Safe monitoring may happen quietly in the background. Actions that could affect your website, budget or public presence should remain under your control.\n\nAutomation must never remove that control.",
    relatedSlugs: [
      "how-will-seo-autopilot-protect-my-budget",
      "will-seo-autopilot-automatically-increase-my-advertising-spend",
    ],
  },
  {
    slug: "why-will-i-still-receive-updates-when-rankings-have-not-changed",
    question: "Why will I still receive updates when rankings have not changed?",
    category: "working-with-seo-autopilot",
    shortAnswer:
      "Because useful work and quieter progress can happen before rankings move.",
    fullExplanation:
      "Updates should reassure you about what was checked, what improved, and what comes next — even in steady periods.\n\nSilence is more worrying than a calm progress note.",
    relatedSlugs: [
      "how-will-i-know-whether-seo-is-working",
      "why-might-progress-appear-slow",
    ],
  },
  {
    slug: "how-will-seo-autopilot-protect-my-budget",
    question: "How will SEO AutoPilot protect my budget?",
    category: "working-with-seo-autopilot",
    shortAnswer:
      "By keeping spend decisions under your control and avoiding “more is always better” advice.",
    fullExplanation:
      "Guidance should reflect your goals and constraints. Sometimes the right recommendation is to maintain or reduce paid spend.\n\nProtecting budget means clarity and consent, not automatic escalation.",
    relatedSlugs: [
      "will-seo-autopilot-automatically-increase-my-advertising-spend",
      "will-changes-be-made-without-my-approval",
    ],
  },
  {
    slug: "will-seo-autopilot-tell-me-when-nothing-needs-changing",
    question: "Will SEO AutoPilot tell me when nothing needs changing?",
    category: "working-with-seo-autopilot",
    shortAnswer: "Yes. Calm periods are valid outcomes.",
    fullExplanation:
      "Not every week needs a dramatic action list. Knowing that foundations are sound and that monitoring continues can be the most reassuring update of all.\n\nBusywork is not the same as progress.",
    relatedSlugs: ["does-seo-ever-stop", "why-will-i-still-receive-updates-when-rankings-have-not-changed"],
  },
];

export function getCategory(id: FaqCategoryId): FaqCategory | undefined {
  return FAQ_CATEGORIES.find((category) => category.id === id);
}

export function getArticle(slug: string): FaqArticle | undefined {
  return FAQ_ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesByCategory(id: FaqCategoryId): FaqArticle[] {
  return FAQ_ARTICLES.filter((article) => article.category === id);
}

export function getRelatedArticles(article: FaqArticle): FaqArticle[] {
  return article.relatedSlugs
    .map((slug) => getArticle(slug))
    .filter((item): item is FaqArticle => item !== undefined);
}
