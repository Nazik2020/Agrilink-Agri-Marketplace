import React from "react";
import { useParams } from "react-router-dom";
import samplePosts from "./SamplePosts.jsx"; // Make sure this path is correct

const BlogDetail = () => {
  const { id } = useParams();

  // Find the post whose id matches the id from URL (as string)
  const post = samplePosts.find((p) => p.id.toString() === id);

  // Debug logging
  console.log("BlogDetail - ID:", id);
  console.log("BlogDetail - Found post:", post);
  console.log("BlogDetail - Post content type:", typeof post?.content);

  if (!post) {
    return (
      <div className="p-8 text-center text-red-500">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg mb-6"
              onError={(e) => {
                console.error("BlogDetail featured image error:", e);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log("BlogDetail featured image loaded:", post.image)}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-6">
              <span className="text-gray-500">No image available</span>
            </div>
          )}

          <p className="text-gray-600 mb-2">
            {post.date} • {post.readTime}
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.content}
        </div>
        
        {/* Debug info */}
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Post ID: {post.id}</p>
          <p>Content Type: {typeof post.content}</p>
          <p>Has Content: {post.content ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
