import React from "react";
import { useParams } from "react-router-dom";
import samplePosts from "../components/blog/SamplePosts"; // Ensure this path is correct

const BlogReading = () => {
    const { id } = useParams();
    console.log("BlogReading: Post ID from URL:", id);

    // Find the post whose id matches the id from URL (as string)
    const post = samplePosts.find((p) => p.id.toString() === id);

    return (
        <section className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="p-8 text-center text-red-500">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-auto h-auto rounded-lg mb-6"
                        onError={(e) => {
                            console.error("BlogDetail featured image error:", e);
                            e.target.style.display = 'none';
                        }}
                        onLoad={() => console.log("BlogDetail featured image loaded:", post.image)}
                    />
                    {post.content}
                </div>
            </div>
        </section>
    );
};

export default BlogReading;