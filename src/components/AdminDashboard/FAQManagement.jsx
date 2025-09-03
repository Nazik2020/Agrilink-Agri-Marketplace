import React, { useEffect, useState } from "react";
// ...existing code...

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAnswers, setEditAnswers] = useState({});
  const [editCategories, setEditCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
    setSuccessMsg("");
    setError(null);
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
                setSuccessMsg("FAQ updated successfully.");
                setShowPopup(true);
                setTimeout(() => {
                  setShowPopup(false);
                  setSuccessMsg("");
                }, 2000);
                fetchFaqs();
              } else {
                setError(catData.message || "Failed to update category.");
              }
            })
            .catch(() => setError("Error updating category."));
        } else {
          setError(data.message || "Failed to update answer.");
        }
      })
      .catch(() => setError("Error updating answer."));
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
              .sort((a, b) => (a.answer ? 1 : -1)) // Unanswered first
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
                    <div className="flex justify-center items-center">
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-700"
                        onClick={() => handleSaveFaq(faq)}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {/* Popup message for success */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#22c55e',
          color: 'white',
          padding: '12px 32px',
          borderRadius: '8px',
          fontWeight: 'bold',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
