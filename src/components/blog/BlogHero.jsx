const BlogHero = () => {
  return (
    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"></div>
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Insights and Updates
        </h1>
        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
          Stay informed with the latest in agriculture and farming techniques
        </p>
        
        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>

)
}

export default BlogHero
