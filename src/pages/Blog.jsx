"use client"; // if needed for hooks

import BlogHero from "../components/blog/BlogHero";
import BlogList from "../components/blog/BlogList";
//import BlogSearch from "../components/blog/BlogSearch";
//import BlogCategories from "../components/blog/BlogCategories";

const Blog = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <BlogHero />
      
      <BlogList />
    </div>
  );
};

export default Blog
