import React, { useState, useMemo } from "react";
import FAQItem from "../components/FAQ/FAQItem";
import SearchBar from "../components/FAQ/SearchBar";
import CategoryDropdown from "../components/FAQ/CategoryDropdown";
import Footer from "../components/common/Footer";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General Questions");
  /* const [openItems, setOpenItems] = useState({});*/
  const [openItemIndex, setOpenItemIndex] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");

  const faqData = [
    {
      category: "General Questions",
      question: "How do I place an order?",
      answer:
        "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. Follow the step-by-step process to complete your purchase.",
    },
    {
      category: "General Questions",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for your convenience.",
    },
    {
      category: "General Questions",
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel your order within 24 hours of placing it. Please contact our customer service team as soon as possible to process the cancellation.",
    },
    {
      category: "Products",
      question: "How do I list my products?",
      answer:
        'To list your products, go to your seller dashboard, click on "Add Product", fill in the product details, upload images, and set your pricing. Your product will be reviewed before going live.',
    },
    {
      category: "Pricing",
      question: "What are the selling fees?",
      answer:
        "Our selling fees are competitive and vary by category. Typically, we charge a 3-8% commission on sold items plus a small transaction fee. Check our seller terms for detailed pricing.",
    },
    {
      category: "Account",
      question: "How do I manage my listings?",
      answer:
        "You can manage all your listings from your seller dashboard. Here you can edit prices, update descriptions, add photos, and track your sales performance.",
    },
  ];

  const categories = ["General Questions", "Products", "Pricing", "Account"];

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "General Questions" ||
        item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleItem = (index) => {
    /* setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));*/
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  const handleSubmitQuestion = () => {
    if (userQuestion.trim()) {
      alert(
        `Thank you for your question: "${userQuestion}". Our team will review it and get back to you soon!`
      );
      setUserQuestion("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 py-25 px-5 text-center overflow-hidden w-full">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <div
            className="absolute w-30 h-30 top-25 left-1/5 bg-green-300 bg-opacity-10 rounded-full backdrop-blur-sm animate-bounce"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute w-20 h-20 top-25 right-1/5 bg-green-300 bg-opacity-10 rounded-full backdrop-blur-sm animate-bounce"
            style={{ animationDuration: "8s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute w-15 h-15 bottom-7 left-1/5 bg-green-300 bg-opacity-10 rounded-full backdrop-blur-sm animate-bounce"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute w-25 h-25 bottom-5 right-1/5 bg-green-300 bg-opacity-10 rounded-full backdrop-blur-sm animate-bounce"
            style={{ animationDuration: "8s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute top-15 left-1/2 transform -translate-x-1/2 text-green-300 text-opacity-5 z-10 pointer-events-none animate-bounce select-none"
            style={{
              fontSize: "280px",
              fontWeight: "bold",
              animationDuration: "5s",
              animationDirection: "reverse",
            }}
          >
            ?
          </div>
        </div>

        <div className="relative z-20 text-center py-20 px-4">
          <h1 className="text-5xl font-bold text-white mb-5 drop-shadow-sm">
            Ask Us Anything
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center">
        <div className="max-w-5xl bg-white rounded-t-3xl -mt-5 relative z-30 p-10 flex flex-col items-stretch w-11/12">
          {/* How can we help section */}
          <div className="text-center mb-10 w-full">
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              How can we help you ?
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Find answers to common questions about buying, selling, payments
              and shipping on AgriLink
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl mx-auto">
            <div className="flex-1">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search for answers"
              />
            </div>
            <div className="w-full md:w-auto md:min-w-[200px]">
              <CategoryDropdown
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-10 w-full max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">FAQs</h3>
            </div>

            <div className="w-full">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    /* isOpen={openItems[index] || false}*/
                    isOpen={openItemIndex === index}
                    onToggle={() => toggleItem(index)}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-lg">
                  No FAQs found matching your search criteria.
                </div>
              )}
            </div>
          </div>

          {/* Add Your Answer Section */}
          <div className="w-full mx-auto p-7 bg-slate-50 rounded-xl border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-5 text-center">
              Add your answer here
            </h4>
            <div className="flex flex-col gap-4">
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Can't find what you're looking for? Submit your question here and our team will get back to you."
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-base font-inherit resize-y min-h-[120px] transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                rows="4"
              />
              <button
                onClick={handleSubmitQuestion}
                className="self-end py-3 px-6 bg-emerald-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-200 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!userQuestion.trim()}
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Full Width */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
