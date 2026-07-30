import { Link } from "react-router-dom";
import type { FaqCategory } from "../content/faq";
import "./FAQCategory.css";

type FAQCategoryProps = {
  category: FaqCategory;
  articleCount: number;
};

export function FAQCategoryNav({ category, articleCount }: FAQCategoryProps) {
  return (
    <a className="faq-category" href={`#${category.id}`}>
      <span className="faq-category__title">{category.title}</span>
      <span className="faq-category__meta">
        {articleCount} {articleCount === 1 ? "guide" : "guides"}
      </span>
      <p className="faq-category__description">{category.description}</p>
    </a>
  );
}

type FAQCategorySectionProps = {
  category: FaqCategory;
  articles: Array<{ slug: string; question: string; shortAnswer: string }>;
};

export function FAQCategorySection({ category, articles }: FAQCategorySectionProps) {
  return (
    <section className="faq-category-section" id={category.id} aria-labelledby={`${category.id}-heading`}>
      <div className="faq-category-section__header">
        <h2 id={`${category.id}-heading`}>{category.title}</h2>
        <p>{category.description}</p>
      </div>
      <ul className="faq-list">
        {articles.map((article) => (
          <li key={article.slug} className="faq-list__item">
            <Link className="faq-list__link" to={`/learn/${article.slug}`}>
              <span className="faq-list__question">{article.question}</span>
              <span className="faq-list__answer">{article.shortAnswer}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
