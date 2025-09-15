import { Link } from "react-router-dom"

const BlogCard = ({ post, isReversed = false }) => {
  return (
    <div className="mb-8">
      <div
        className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-50 flex flex-col ${
          isReversed ? "md:flex-row-reverse" : "md:flex-row"
        } group shadow-lg hover:shadow-xl`}
      >
        {/* Image Section */}
<div
  className="relative w-full md:w-96 flex-shrink-0 overflow-hidden"
  style={{ minHeight: 180 }}
>
  {post.image ? (
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover object-center"
      onError={(e) => {
        e.target.style.display = "none"
      }}
    />
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
      No Image Available
    </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transform transition-all duration-300 group-hover:scale-105">
              {post.category}
            </span>
          </div>

          
        </div>

        {/* Content Section */}
        <div
          className={`p-6 flex-1 flex flex-col justify-center ${
            isReversed ? "md:pr-8" : "md:pl-8"
          } transition-all duration-300`}
        >
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="font-medium">{post.date}</span>
            <span className="mx-2 text-green-600 font-bold">•</span>
            <span className="font-medium">{post.readTime}</span>
          </div>

          {/* Make title clickable too */}
          <Link to={`/blog/${post.id}`} className="block">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-300 leading-tight cursor-pointer">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

          {/* Read More Button */}
          <Link to={`/blog/${post.id}`} className="inline-block">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out w-fit hover:shadow-xl hover:-translate-y-1 transform group-hover:scale-105 flex items-center space-x-2">
              <span>Read More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
