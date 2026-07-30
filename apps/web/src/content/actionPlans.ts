/**
 * Sprint D7 — Guided Action Plan mock models.
 *
 * Practical step-by-step plans for selected opportunities.
 * Session confirmation only — no autonomous execution.
 */

export type ActionPlanCompletionState = "not_started" | "in_progress" | "completed";

export interface ActionPlanLearningGuide {
  title: string;
  href: string;
}

export interface ActionPlanAskReference {
  /** Suggested question text for Ask handoff (query param). */
  suggestedQuestion: string;
}

export interface ActionPlanStepDefinition {
  id: string;
  title: string;
  whatToDo: string;
  whyItMatters: string;
  helpfulGuidance: string;
  relatedLearningGuide?: ActionPlanLearningGuide;
  askReference?: ActionPlanAskReference;
}

export interface ActionPlanDefinition {
  actionPlanId: string;
  opportunitySlug: string;
  title: string;
  introduction: string;
  estimatedTime: string;
  steps: ActionPlanStepDefinition[];
}

export const MOCK_ACTION_PLANS: ActionPlanDefinition[] = [
  {
    actionPlanId: "plan-faq-questions",
    opportunitySlug: "answer-common-customer-questions",
    title: "Add clear answers to common customer questions",
    introduction:
      "We’ll gather the questions customers already ask, write plain-English answers, and place them where visitors can find them calmly — without rebuilding your whole website.",
    estimatedTime: "About 30–45 minutes",
    steps: [
      {
        id: "faq-list",
        title: "List the questions you hear most",
        whatToDo:
          "Write down five questions customers ask before they book — for example response times, areas covered, or what happens on a first visit.",
        whyItMatters:
          "Real questions from real customers are more useful than guessed topics. This keeps your answers practical.",
        helpfulGuidance:
          "If you are unsure, start with: How soon can you come? Which areas do you cover? Do you provide a quote before work starts?",
        relatedLearningGuide: {
          title: "What is SEO?",
          href: "/learn/what-is-seo",
        },
      },
      {
        id: "faq-write",
        title: "Write short, plain answers",
        whatToDo:
          "Answer each question in two or three everyday sentences. Avoid jargon and keep the tone reassuring.",
        whyItMatters:
          "Visitors decide quickly. Clear answers help them feel understood and ready to contact you.",
        helpfulGuidance:
          "Read each answer aloud. If it sounds like something you would say on the phone, it is probably clear enough.",
        askReference: {
          suggestedQuestion: "How do FAQ pages help?",
        },
      },
      {
        id: "faq-place",
        title: "Add the answers to your website",
        whatToDo:
          "Place the questions and answers on a simple FAQ section of your homepage or a dedicated page your visitors can find easily.",
        whyItMatters:
          "Answers only help if people can find them. A clear section near your main offer works well.",
        helpfulGuidance:
          "Use the real questions as headings. Keep the layout simple — no need for a complex redesign.",
      },
      {
        id: "faq-contact",
        title: "Keep a contact path beside the answers",
        whatToDo:
          "Make sure a phone number or enquiry option sits near the FAQ section so interested visitors can act immediately.",
        whyItMatters:
          "When someone feels reassured by an answer, the next step should be obvious.",
        helpfulGuidance:
          "On a phone, tap the number yourself to confirm it works.",
        relatedLearningGuide: {
          title: "How will I know whether SEO is working?",
          href: "/learn/how-will-i-know-whether-seo-is-working",
        },
      },
      {
        id: "faq-review",
        title: "Review the finished section",
        whatToDo:
          "Read the full FAQ section once more and fix anything unclear or incomplete.",
        whyItMatters:
          "A final calm pass prevents small mistakes that create hesitation.",
        helpfulGuidance:
          "Ask a colleague or family member to read it and tell you if anything feels confusing.",
      },
      {
        id: "faq-confirm",
        title: "Confirm the improvement is live",
        whatToDo:
          "Open the live page on your phone and desktop, then confirm the FAQ section is visible and readable.",
        whyItMatters:
          "An opportunity is complete only when the action has been carried out and checked.",
        helpfulGuidance:
          "If something is missing, fix it before marking this plan complete.",
      },
    ],
  },
  {
    actionPlanId: "plan-recent-reviews",
    opportunitySlug: "gather-recent-reviews",
    title: "Gather a few recent customer reviews",
    introduction:
      "A small number of honest, recent reviews helps future customers trust you. We’ll choose who to ask, send a polite request, and respond thoughtfully when feedback arrives.",
    estimatedTime: "About 15–30 minutes to set up",
    steps: [
      {
        id: "reviews-choose",
        title: "Choose three recent happy customers",
        whatToDo:
          "Pick three customers from the last few months who were clearly pleased with your work.",
        whyItMatters:
          "Recent genuine reviews are more persuasive than a long list of old ones.",
        helpfulGuidance:
          "Choose people you would feel comfortable asking — quality matters more than quantity.",
      },
      {
        id: "reviews-ask",
        title: "Send a short, polite request",
        whatToDo:
          "Message each customer with a brief thank-you and a simple request for an honest Google review.",
        whyItMatters:
          "A calm personal ask feels respectful and usually works better than a pushy campaign.",
        helpfulGuidance:
          "Keep it short. Mention the job briefly and share the review link if you have one.",
        askReference: {
          suggestedQuestion: "Why are customer reviews important?",
        },
        relatedLearningGuide: {
          title: "Why are customer reviews important?",
          href: "/learn/why-are-customer-reviews-important",
        },
      },
      {
        id: "reviews-thank",
        title: "Thank anyone who leaves feedback",
        whatToDo:
          "When a review appears, thank the customer sincerely — publicly if appropriate, or privately as well.",
        whyItMatters:
          "Appreciation encourages honesty and shows new visitors that you care.",
        helpfulGuidance:
          "A sentence or two in your own words is enough. Avoid copy-paste replies.",
        relatedLearningGuide: {
          title: "Should I reply to every Google review?",
          href: "/learn/should-i-reply-to-every-google-review",
        },
      },
      {
        id: "reviews-confirm",
        title: "Confirm your review presence looks current",
        whatToDo:
          "Check your Google Business Profile and confirm the newest reviews are visible.",
        whyItMatters:
          "Completing the ask is only useful if the feedback is where future customers will see it.",
        helpfulGuidance:
          "If a review is missing, wait a little — publishing can take time — then check again.",
      },
    ],
  },
  {
    actionPlanId: "plan-service-areas",
    opportunitySlug: "clarify-service-areas",
    title: "Spell out the areas you serve",
    introduction:
      "Nearby customers want to know you cover their area. We’ll write an honest list of places you serve and place it clearly on your key pages.",
    estimatedTime: "About 20–30 minutes",
    steps: [
      {
        id: "areas-list",
        title: "Write the areas you truly cover",
        whatToDo:
          "List the towns or areas you serve in everyday language. Only include places you are genuinely happy to work in.",
        whyItMatters:
          "Honest coverage builds trust. Overclaiming creates disappointment.",
        helpfulGuidance:
          "For Harbour View Plumbing, start with Bristol and the nearby areas you regularly cover.",
        relatedLearningGuide: {
          title: "What is local SEO?",
          href: "/learn/what-is-local-seo",
        },
      },
      {
        id: "areas-homepage",
        title: "Add the list to your homepage",
        whatToDo:
          "Place a short “Areas we cover” note near your main offer so visitors see it quickly.",
        whyItMatters:
          "Local relevance should be obvious without forcing people to dig.",
        helpfulGuidance:
          "A simple sentence plus a short list is usually enough.",
        askReference: {
          suggestedQuestion: "How can I improve my homepage?",
        },
      },
      {
        id: "areas-contact",
        title: "Repeat the areas on your contact page",
        whatToDo:
          "Add the same service-area wording to your contact or enquiry page for consistency.",
        whyItMatters:
          "Consistent details reassure customers and reduce confusion.",
        helpfulGuidance:
          "Use the same place names in the same order on both pages.",
      },
      {
        id: "areas-confirm",
        title: "Confirm the wording is live and clear",
        whatToDo:
          "Open the live pages and check that the service areas are easy to find on a phone.",
        whyItMatters:
          "The opportunity is complete only when customers can actually see the information.",
        helpfulGuidance:
          "If the text is buried, move it higher before finishing.",
      },
    ],
  },
];

export function getActionPlanByOpportunitySlug(
  slug: string,
): ActionPlanDefinition | undefined {
  return MOCK_ACTION_PLANS.find((plan) => plan.opportunitySlug === slug);
}

export function hasActionPlan(slug: string): boolean {
  return getActionPlanByOpportunitySlug(slug) !== undefined;
}
