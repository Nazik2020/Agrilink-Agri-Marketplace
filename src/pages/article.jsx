import { useRouter } from 'next/router';

const articles = [
  {
    id: 1,
    title: "My First Article",
    date: "July 16, 2025",
    content: (
      <>
        <p>This is the full content of the first article.</p>
        <p>You can add HTML or React components here.</p>
      </>
    ),
  },
  {
    id: 2,
    title: "Second Article",
    date: "July 15, 2025",
    content: (
      <>
        <p>This is the second article’s content.</p>
      </>
    ),
  },
];

const ArticlePage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Wait for id to be available (during first render in Next.js)
  if (!id) return <p>Loading...</p>;

  // Note: router.query.id is string, convert to number to match id type
  const article = articles.find((a) => a.id === parseInt(id, 10));

  if (!article) return <p>Article not found</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.date}</p>
      <div>{article.content}</div>
    </div>
  );
};

export default ArticlePage;
