import React from "react";
import { FaTimes } from "react-icons/fa";

const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="prose max-w-none">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📄 AgriLink Marketplace – Terms and Conditions
              </h1>
              <p className="text-gray-600">Effective Date: January 2025</p>
            </div>

            <p className="text-gray-700 mb-6">
              Welcome to AgriLink, a digital marketplace connecting farmers, producers, and agricultural suppliers with global buyers. By accessing or using the AgriLink platform, you agree to the following Terms and Conditions.
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By registering on or using the AgriLink platform, you confirm that you are at least 18 years old and legally capable of entering into binding agreements. If you do not agree with these terms, do not use the platform.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Account Registration</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Users must provide accurate and complete information during registration.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>AgriLink reserves the right to suspend or terminate accounts for suspicious or fraudulent activities.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Marketplace Use</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AgriLink serves as a neutral platform for connecting sellers and buyers of agricultural products (e.g., tea, cinnamon, spices, fertilizers, seeds).</li>
                  <li>We do not guarantee the quality, origin, or legality of products listed, although we encourage verified suppliers and transparency.</li>
                  <li>Users must comply with all applicable local and international trade, export, and agriculture regulations.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Product Listings</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Sellers are responsible for ensuring product descriptions, prices, and images are accurate.</li>
                  <li>Misleading or false information may result in listing removal or account suspension.</li>
                  <li>AgriLink reserves the right to approve, edit, or remove listings that violate policies or legal standards.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Transactions & Payments</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AgriLink may offer or integrate secure payment gateways for buyer-seller transactions.</li>
                  <li>We are not liable for disputes arising from transactions conducted outside of the platform.</li>
                  <li>Fees, commissions, or transaction charges (if any) will be clearly stated before completion of any payment.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Refunds & Returns</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All sales on AgriLink are considered final.</li>
                  <li>No refunds will be issued once a purchase has been confirmed and processed, unless otherwise stated by the seller in writing.</li>
                  <li>Sellers may offer return or exchange policies at their discretion, but such terms must be clearly defined and agreed upon prior to purchase.</li>
                  <li>Buyers are responsible for reviewing product details and seller terms before completing any transaction.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Reviews & Feedback</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Verified buyers may leave reviews after transactions.</li>
                  <li>Abusive, defamatory, or fraudulent reviews will be removed.</li>
                  <li>Sellers may not manipulate or incentivize feedback.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Intellectual Property</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All content on the AgriLink platform (logo, brand, UI, etc.) is protected under copyright laws.</li>
                  <li>Users retain ownership of the content they upload but grant AgriLink a non-exclusive license to display it on the platform.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Termination</h3>
                <p className="text-gray-700">
                  AgriLink reserves the right to suspend or terminate accounts that violate these terms or engage in illegal, fraudulent, or abusive activity.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Limitation of Liability</h3>
                <p className="text-gray-700 mb-2">AgriLink shall not be held liable for:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Direct or indirect losses arising from use of the platform</li>
                  <li>Disputes between buyers and sellers</li>
                  <li>Product quality, safety, or delivery delays</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Modifications</h3>
                <p className="text-gray-700">
                  We may update these Terms and Conditions at any time. Continued use of the platform after updates indicates acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">13. Governing Law</h3>
                <p className="text-gray-700">
                  These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Us</h3>
                <p className="text-gray-700 mb-2">For any questions or concerns regarding these terms, please contact us at:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>Email: info@agrilink.com</li>
                  <li>Phone: +94-77-5835521</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        
        </div>
      </div>

  );
};

export default TermsAndConditions; 