import React, { useState, useMemo } from "react";
import FAQItem from "../components/FAQ/FAQItem";
import SearchBar from "../components/FAQ/SearchBar";
import CategoryDropdown from "../components/FAQ/CategoryDropdown";
import Footer from "../components/common/Footer";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openItemIndex, setOpenItemIndex] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null); // { type: 'success'|'error', message: string }

  // Simple PopupMessage used elsewhere in the app (green/red overlay)
  const PopupMessage = ({ message, type, onClose }) => {
    if (!message) return null;
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const icon = isSuccess ? '✔️' : '⚠️';
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
        <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
          <div className="flex items-start space-x-3">
            <div className={`${textColor} flex-shrink-0 mt-0.5`} style={{fontWeight:'bold',fontSize:'1.5em'}}>{icon}</div>
            <div className="flex-1">
              <p className={`${textColor} text-sm font-medium leading-relaxed`}>{message}</p>
            </div>
            <button onClick={onClose} className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}>×</button>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSuccess ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>OK</button>
          </div>
        </div>
      </div>
    );
  };

  // Fetch FAQs from backend
  React.useEffect(() => {
    setLoading(true);
    fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/get_faqs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFaqs(data.faqs);
          // Extract unique categories
          const cats = Array.from(new Set(data.faqs.map(f => f.category).filter(Boolean)));
          setCategories(cats.length ? cats : ["General Questions"]);
          setSelectedCategory(cats[0] || "General Questions");
        } else {
          setError(data.message || "Failed to load FAQs.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error loading FAQs.");
        setLoading(false);
      });
  }, []);

  const filteredFAQs = React.useMemo(() => {
    return faqs.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.answer ? item.answer.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  const toggleItem = (index) => {
    /* setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));*/
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  const handleSubmitQuestion = () => {
    if (!userQuestion.trim()) return;

    // Only customers or sellers may submit a question
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      setPopup({ type: 'error', message: 'Please register to the system to submit your question.' });
      setTimeout(() => setPopup(null), 3000);
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const role = (user?.role || '').toLowerCase();
      if (role !== 'customer' && role !== 'seller') {
        setPopup({ type: 'error', message: 'Please register to the system to submit your question.' });
        setTimeout(() => setPopup(null), 3000);
        return;
      }

      fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/add_faq.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          submitted_by: user.id,
          role: user.role
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserQuestion("");
            setPopup({ type: 'success', message: 'Your question has been submitted successfully.' });
            setTimeout(() => setPopup(null), 2000);
            // Refresh FAQs
            setLoading(true);
            fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/get_faqs.php")
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  setFaqs(data.faqs);
                }
                setLoading(false);
              });
          } else {
            setPopup({ type: 'error', message: data.message || 'Failed to submit question.' });
            setTimeout(() => setPopup(null), 3000);
          }
        })
        .catch(() => {
          setPopup({ type: 'error', message: 'Error submitting question.' });
          setTimeout(() => setPopup(null), 3000);
        });
    } catch (_e) {
      setPopup({ type: 'error', message: 'Please register to the system to submit your question.' });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {popup && (
        <PopupMessage message={popup.message} type={popup.type} onClose={() => setPopup(null)} />
      )}
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
              {loading ? (
                <div className="text-center py-10 text-gray-500 text-lg">Loading FAQs...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500 text-lg">{error}</div>
              ) : filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
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
              Add your question here
            </h4>
            <div className="flex flex-col gap-4">
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Can't find what you're looking for? Submit your question here and our team will get back to you within 72 hours. Please check the FAQ section for an answer."
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
