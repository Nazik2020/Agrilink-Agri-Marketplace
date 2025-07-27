import BlogHero from "../components/blog/BlogHero"
import BlogList from "../components/blog/BlogList"
import Footer from "../components/common/Footer"

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHero />
      <BlogList />
      <Footer />
    </div>
  )
}

export default Blog
