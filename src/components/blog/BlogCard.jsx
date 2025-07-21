import { Link } from "react-router-dom";

const BlogCard = ({ post, isReversed = false }) => {
  // Debug logging
  console.log("=== BLOG CARD DEBUG ===");
  console.log("Post title:", post.title);
  console.log("Post image value:", post.image);
  console.log("Post image type:", typeof post.image);
  console.log("Post image src (if string):", typeof post.image === 'string' ? post.image : 'Not a string');
  console.log("=== END BLOG CARD DEBUG ===");
  
  return (
    <div className="mb-8">
      <div
        className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-50 flex flex-col ${
          isReversed ? "md:flex-row-reverse" : "md:flex-row"
        } group`}
      >
        {/* Image Section */}
        <div className="relative md:w-96 flex-shrink-0 transition-transform duration-300 overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-56 md:h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                console.error("BlogCard image error for post:", post.title, "Image:", post.image, e);
                console.error("BlogCard image error details:", {
                  title: post.title,
                  image: post.image,
                  imageType: typeof post.image,
                  imageSrc: e.target.src
                });
                e.target.style.display = 'none';
                // Show fallback content
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-56 md:h-full bg-gray-200 flex items-center justify-center text-gray-500';
                fallback.innerHTML = 'Image Failed to Load';
                e.target.parentNode.appendChild(fallback);
              }}
              onLoad={() => console.log("BlogCard image loaded successfully for:", post.title, "Image:", post.image)}
            />
          ) : (
            <div className="w-full h-56 md:h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transform transition-all duration-300 group-hover:scale-105">
              {post.category}
            </span>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
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

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-300 leading-tight">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          <Link to={`/blog/${post.id}`}>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out w-fit hover:shadow-xl hover:-translate-y-1 transform group-hover:scale-105">
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
