import { FAQCategoryNav, FAQCategorySection } from "../components/FAQCategory";
import { PageContainer } from "../components/PageContainer";
import { PageIntro } from "../components/PageIntro";
import {
  FAQ_ARTICLES,
  FAQ_CATEGORIES,
  getArticlesByCategory,
} from "../content/faq";
import "./LearningCentrePage.css";

export function LearningCentrePage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Learning Centre"
        title="Understand online growth without the jargon."
        description={
          <p>
            Clear answers to common questions about SEO, Google Ads, rankings, traffic
            and growing your business online.
          </p>
        }
      />

      <nav className="learn-nav" aria-label="Learning Centre categories">
        <p className="learn-nav__label">Browse by topic</p>
        <div className="learn-nav__list">
          {FAQ_CATEGORIES.map((category) => (
            <FAQCategoryNav
              key={category.id}
              category={category}
              articleCount={getArticlesByCategory(category.id).length}
            />
          ))}
        </div>
      </nav>

      <p className="learn-count">
        {FAQ_ARTICLES.length} guides across {FAQ_CATEGORIES.length} topics
      </p>

      {FAQ_CATEGORIES.map((category) => (
        <FAQCategorySection
          key={category.id}
          category={category}
          articles={getArticlesByCategory(category.id).map((article) => ({
            slug: article.slug,
            question: article.question,
            shortAnswer: article.shortAnswer,
          }))}
        />
      ))}
    </PageContainer>
  );
}
