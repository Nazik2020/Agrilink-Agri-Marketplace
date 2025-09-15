<<<<<<< HEAD
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
=======
import BlogHero from "../components/blog/BlogHero"
import BlogList from "../components/blog/BlogList"
import Footer from "../components/common/Footer"

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHero />
      <BlogList />
      <Footer />
>>>>>>> 547fde602467591e1d73f6e6bb63cf4e2cfcc7e4
    </div>
  )
}

export default Blog
