import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const FAQManagement = () => {
  // Custom PopupMessage (from ContentModeration)
  const PopupMessage = ({ message, type, onClose, onConfirm, showConfirm }) => {
    if (!message) return null;
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
        <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
          <div className="flex items-start space-x-3">
            <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
              {isSuccess ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`${textColor} text-sm font-medium leading-relaxed`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            {showConfirm ? (
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-600 hover:bg-red-700 text-white`}
              >
                OK
              </button>
            ) : (
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSuccess 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };
  const closePopup = () => {
    setPopupMessage(null);
    setPopupType('success');
    setConfirmDeleteId(null);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/delete_faq.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faq_id: confirmDeleteId })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFaqs(prev => prev.filter(faq => faq.id !== confirmDeleteId));
            showPopup("FAQ deleted successfully.", "success");
          } else {
            showPopup(data.message || "Failed to delete FAQ.", "error");
          }
        })
        .catch(() => showPopup("Error deleting FAQ.", "error"));
      setConfirmDeleteId(null);
    }
  };

  const handleDeleteFaq = (faqId) => {
    setConfirmDeleteId(faqId);
    showPopup("Are you sure you want to delete this FAQ?", "error");
  };
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAnswers, setEditAnswers] = useState({});
  const [editCategories, setEditCategories] = useState({});
  const [categories, setCategories] = useState([]);
 

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    setLoading(true);
    fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/get_faqs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFaqs(data.faqs);
          // Extract unique categories
          const cats = Array.from(new Set(data.faqs.map(f => f.category).filter(Boolean)));
          setCategories(cats.length ? cats : ["General Questions"]);
        } else {
          setError(data.message || "Failed to load FAQs.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error loading FAQs.");
        setLoading(false);
      });
  };

  const handleAnswerChange = (id, value) => {
    setEditAnswers({ ...editAnswers, [id]: value });
  };

  const handleCategoryChange = (id, value) => {
    setEditCategories({ ...editCategories, [id]: value });
  };

  // Save both answer and category together
  const handleSaveFaq = (faq) => {
    // First update answer, then category
    fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/answer_faq.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faq_id: faq.id, answer: editAnswers[faq.id] !== undefined ? editAnswers[faq.id] : faq.answer || "" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Now update category
          fetch("http://localhost/Agrilink-Agri-Marketplace/backend/faq/update_category.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ faq_id: faq.id, category: editCategories[faq.id] !== undefined ? editCategories[faq.id] : faq.category || "General Questions" }),
          })
            .then((res) => res.json())
            .then((catData) => {
              if (catData.success) {
                showPopup("FAQ updated successfully.", "success");
                fetchFaqs();
              } else {
                showPopup(catData.message || "Failed to update category.", "error");
              }
            })
            .catch(() => showPopup("Error updating category.", "error"));
        } else {
          showPopup(data.message || "Failed to update answer.", "error");
        }
      })
      .catch(() => showPopup("Error updating answer.", "error"));
  };

  return (
    <div className="p-8">
              <h2 className="text-2xl font-bold  text-green-700 mb-2">
        FAQ Management</h2>
        <p className="text-muted-foreground mb-10">
         “A well-managed FAQ empowers users with answers, reduces confusion, and keeps your platform running smoothly.”
        </p>
      {loading ? (
        <div>Loading FAQs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border-collapse">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '45%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Question</th>
              <th className="border p-2">Answer</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs
              .sort((a, b) => (a.answer ? 1 : -1)) // Unanswered FAQs first showing 
              .map((faq) => (
                <tr key={faq.id} className="border-b">
                  <td className="border p-2 text-gray-800" style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{faq.question}</td>
                  <td className="border p-2" style={{ minWidth: '300px' }}>
                    <textarea
                      className="w-full border rounded p-2"
                      value={editAnswers[faq.id] !== undefined ? editAnswers[faq.id] : faq.answer || ""}
                      onChange={(e) => handleAnswerChange(faq.id, e.target.value)}
                      rows={4}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </td>
                  <td className="border p-2">
                    <div className="flex justify-center items-center">
                      <select
                        className="border rounded p-2"
                        value={editCategories[faq.id] !== undefined ? editCategories[faq.id] : faq.category || "General Questions"}
                        onChange={(e) => handleCategoryChange(faq.id, e.target.value)}
                      >
                        {/* Only add 'General Questions' if not already present */}
                        {categories.includes("General Questions")
                          ? categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))
                          : [<option key="General Questions" value="General Questions">General Questions</option>,
                             ...categories.map((cat) => (
                               <option key={cat} value={cat}>{cat}</option>
                             ))]
                        }
                      </select>
                    </div>
                  </td>
                  <td className="border p-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-700"
                        onClick={() => handleSaveFaq(faq)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                        title="Delete FAQ"
                        onClick={() => handleDeleteFaq(faq.id)}
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
        onConfirm={confirmDelete}
        showConfirm={!!confirmDeleteId && popupType === 'error'}
      />
    </div>
  );
};

export default FAQManagement;
