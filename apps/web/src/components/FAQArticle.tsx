import { Link } from "react-router-dom";
import type { FaqArticle as FaqArticleData } from "../content/faq";
import { getArticle, getCategory, getRelatedArticles } from "../content/faq";
import { NextStepPanel } from "./NextStepPanel";
import { PlainLanguageNote } from "./PlainLanguageNote";
import "./FAQArticle.css";

type FAQArticleProps = {
  article: FaqArticleData;
};

export function FAQArticleView({ article }: FAQArticleProps) {
  const category = getCategory(article.category);
  const related = getRelatedArticles(article);
  const paragraphs = article.fullExplanation
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const nextRelated = article.nextStep
    ? article.relatedSlugs.map((slug) => getArticle(slug)).find((item) => item !== undefined)
    : undefined;

  return (
    <article className="faq-article">
      <nav className="faq-article__crumb" aria-label="Breadcrumb">
        <Link to="/learn">Learning Centre</Link>
        {category ? (
          <>
            <span aria-hidden="true"> / </span>
            <Link to={`/learn#${category.id}`}>{category.title}</Link>
          </>
        ) : null}
      </nav>

      <h1 className="faq-article__title">{article.question}</h1>

      <PlainLanguageNote>
        <p>{article.shortAnswer}</p>
      </PlainLanguageNote>

      <div className="faq-article__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 64)}>{paragraph}</p>
        ))}
      </div>

      {article.nextStep && nextRelated ? (
        <NextStepPanel label={article.nextStep} href={`/learn/${nextRelated.slug}`} />
      ) : null}

      {related.length > 0 ? (
        <section className="faq-article__related" aria-labelledby="related-heading">
          <h2 id="related-heading">Related questions</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link to={`/learn/${item.slug}`}>{item.question}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
