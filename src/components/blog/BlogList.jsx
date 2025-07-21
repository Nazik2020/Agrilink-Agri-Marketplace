import { useState, useEffect } from "react"
import BlogCard from "./BlogCard.jsx";
import BlogSearch from "./BlogSearch"
import BlogCategories from "./BlogCategories"
import SamplePosts from "./SamplePosts.jsx";

// Debug logging for imports
console.log("BlogList: SamplePosts import:", SamplePosts);


const BlogList = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)

  const categories = [
    { name: "Technology", icon: "🚜", count: 2 },
    { name: "Sustainability", icon: "🌱", count: 2 },
    { name: "Management", icon: "📊", count: 1 },
    { name: "Innovation", icon: "💡", count: 1 },
    { name: "Tips", icon: "💧", count: 1 },
  ]

  useEffect(() => {
    console.log("BlogList: Setting posts from SamplePosts");
    console.log("BlogList: SamplePosts data:", SamplePosts);
    console.log("BlogList: SamplePosts length:", SamplePosts.length);
    console.log("BlogList: First post image:", SamplePosts[0]?.image);
    console.log("BlogList: First post title:", SamplePosts[0]?.title);
    console.log("BlogList: All post titles:", SamplePosts.map(post => post.title));
    setPosts(SamplePosts)
    setFilteredPosts(SamplePosts)
  }, [])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
  }

  const loadMorePosts = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blogs</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay informed with the latest insights, tips, and trends in agriculture and farming
        </p>
      </div>

      {/* Featured Articles Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-left">Featured Articles</h3>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredPosts.map((post, index) => (
              <div key={post.id}>
                <BlogCard post={post} isReversed={index % 2 === 1} />
                {index < filteredPosts.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-full max-w-md border-t-2 border-dashed border-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 transform disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Load More Articles"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogList
