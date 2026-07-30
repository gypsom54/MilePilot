import { Link, useParams } from "react-router-dom";
import { FAQArticleView } from "../components/FAQArticle";
import { PageContainer } from "../components/PageContainer";
import { getArticle } from "../content/faq";
import "./FaqArticlePage.css";

export function FaqArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return (
      <PageContainer narrow>
        <div className="faq-not-found">
          <h1>Guide not found</h1>
          <p>
            That Learning Centre page is not available. You can return to the full list
            of guides and choose another topic.
          </p>
          <Link to="/learn">Back to the Learning Centre</Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <FAQArticleView article={article} />
    </PageContainer>
  );
}
