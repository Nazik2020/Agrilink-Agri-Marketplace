"use client"

import { useState, useEffect } from "react"
import BlogCard from "./BlogCard"
import BlogSearch from "./BlogSearch"
import SamplePosts from "./SamplePosts"

const BlogList = () => {
  const [allPosts, setAllPosts] = useState([])
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)

  const POSTS_PER_PAGE = 3 // Show 3 posts initially, then 2 more each time

  useEffect(() => {
    // Initialize with all posts
    setAllPosts(SamplePosts)
    setFilteredPosts(SamplePosts)
    // Show only first 3 posts initially
    setDisplayedPosts(SamplePosts.slice(0, POSTS_PER_PAGE))
    setHasMorePosts(SamplePosts.length > POSTS_PER_PAGE)
  }, [])

  useEffect(() => {
    let filtered = allPosts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)

    // Reset pagination when filters change
    const initialDisplayCount = Math.min(POSTS_PER_PAGE, filtered.length)
    setDisplayedPosts(filtered.slice(0, initialDisplayCount))
    setCurrentPage(1)
    setHasMorePosts(filtered.length > initialDisplayCount)
  }, [allPosts, searchTerm, selectedCategory])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
  }

  const loadMorePosts = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = currentPage * POSTS_PER_PAGE
      const endIndex = startIndex + 2 // Load 2 more posts each time after initial load

      const newPosts = filteredPosts.slice(0, endIndex)
      setDisplayedPosts(newPosts)
      setCurrentPage(nextPage)

      // Check if there are more posts to load
      setHasMorePosts(endIndex < filteredPosts.length)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full max-w-full px-40 py-12 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blogs</h2>
        <p className="text-base text-gray-600 max-w-4xl mx-auto">
        Stay informed with the latest insights, expert tips, and emerging trends in agriculture and farming.
        From sustainable cultivation practices to global market movements, explore valuable knowledge that helps 
        growers, exporters, and agri-entrepreneurs stay ahead in a fast-evolving industry.        </p>
      </div>

      <BlogSearch onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />

      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Featured Articles</h3>
          {filteredPosts.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {displayedPosts.length} of {filteredPosts.length} articles
            </div>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="space-y-16">
            {displayedPosts.map((post, index) => (
              <div key={post.id}>
                <BlogCard post={post} isReversed={index % 2 === 1} />
                {index < displayedPosts.length - 1 && (
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
      {filteredPosts.length > 0 && hasMorePosts && (
        <div className="text-center">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 transform disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading more articles...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Load More Articles</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      )}

      {/* End of articles message */}
      {filteredPosts.length > 0 && !hasMorePosts && displayedPosts.length > POSTS_PER_PAGE && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-12 border-t border-gray-300"></div>
            <span className="text-sm font-medium">You've reached the end</span>
            <div className="w-12 border-t border-gray-300"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">That's all {filteredPosts.length} articles we have for you!</p>
        </div>
      )}
    </div>
  )
}

export default BlogList
