"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SamplePosts from "./SamplePosts"
import Footer from "../common/Footer"

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    // Simulate loading delay
    setLoading(true)

    setTimeout(() => {
      const foundPost = SamplePosts.find((p) => p.id.toString() === id)
      setPost(foundPost)

      if (foundPost) {
        // Get related posts from same category
        const related = SamplePosts.filter((p) => p.id !== foundPost.id && p.category === foundPost.category).slice(
          0,
          3,
        )
        setRelatedPosts(related)
      }

      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <div className="text-gray-300">|</div>
            <Link to="/blog" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
              All Articles
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <article className="rounded-lg p-6 mb-6">
          <div className="mb-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">{post.title}</h1>

          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span className="font-medium">{post.date}</span>
            <span className="mx-2">•</span>
            <span className="font-medium">{post.readTime}</span>
          </div>

          {post.image && (
            <div className="mb-6">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  // Error handler removed
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
          </div>
        </article>

        {/* Content Section */}
        <div className="rounded-lg overflow-hidden mb-8">{post.content}</div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group block">
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                    {relatedPost.image && (
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default BlogDetail
