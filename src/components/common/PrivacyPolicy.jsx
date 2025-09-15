import React from "react";
import { FaTimes } from "react-icons/fa";

const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white  max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
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
                🔒 AgriLink Privacy Policy
              </h1>
              <p className="text-gray-600">Effective Date: January 2025</p>
            </div>

            <p className="text-gray-700 mb-6">
              AgriLink values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
                <p className="text-gray-700 mb-3">We collect the following types of information:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and contact details</li>
                  <li><strong>Account Information:</strong> Username, password, and profile information</li>
                  <li><strong>Transaction Data:</strong> Purchase history, payment information, and order details</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, and features used</li>
                  <li><strong>Device Information:</strong> IP address, browser type, and device identifiers</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
                <p className="text-gray-700 mb-3">We use your information for the following purposes:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>To provide and maintain our marketplace services</li>
                  <li>To process transactions and facilitate buyer-seller interactions</li>
                  <li>To communicate with you about your account and transactions</li>
                  <li>To improve our platform and user experience</li>
                  <li>To ensure platform security and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All data is stored securely using industry-standard encryption</li>
                  <li>We implement appropriate security measures to protect against unauthorized access</li>
                  <li>Regular security audits and updates are conducted</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Sharing</h3>
                <p className="text-gray-700 mb-3">We do not sell, rent, or share your personal data with third parties except:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>When legally required by law enforcement or regulatory authorities</li>
                  <li>To facilitate transactions between buyers and sellers (only necessary information)</li>
                  <li>With trusted service providers who assist in platform operations (under strict confidentiality agreements)</li>
                  <li>With your explicit consent for specific purposes</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
                <p className="text-gray-700 mb-3">You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking</h3>
                <p className="text-gray-700 mb-3">We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Remember your preferences and login status</li>
                  <li>Analyze platform usage and improve performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We retain your data for as long as your account is active</li>
                  <li>Transaction data is retained for legal and accounting purposes</li>
                  <li>Upon account deletion, data is permanently removed within 30 days</li>
                  <li>Some data may be retained longer if required by law</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Children's Privacy</h3>
                <p className="text-gray-700">
                  AgriLink is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">International Data Transfers</h3>
                <p className="text-gray-700">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h3>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the effective date. Your continued use of AgriLink after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-700 mb-2">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>Email: info@agrilink.com</li>
                  <li>Phone: +94-77-5835521</li>
                  <li>Address: AgriLink Headquarters, Colombo, Sri Lanka</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection Officer</h3>
                <p className="text-gray-700">
                  For specific privacy concerns or to exercise your data rights, you may contact our Data Protection Officer at dpo@agrilink.com.
                </p>
              </section>
            </div>
          </div>
        </div>

        </div>
      </div>
    
  );
};

export default PrivacyPolicy; 