import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    // Only send name, email, message to backend
    try {
      const res = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/contact/send_contact_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Your message has been sent!' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white py-16 px-4 min-w-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Our Information Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Information</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At <span className="font-semibold text-green-600">AgriLink</span>, we connect the world to Sri 
              Lanka's finest tea, coffee, cinnamon, and more. Whether you're a global buyer seeking 
              premium exports or a local grower ready to reach new markets, we're here to help. Reach 
              out to us today and let's cultivate success together, across continents.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">E-mail</h3>
                  <p className="text-gray-600">info@agrilink.lk</p>
                  <p className="text-gray-600">support@agrilink.lk</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                  <p className="text-gray-600">+94 11 234 5678</p>
                  <p className="text-gray-600">+94 77 123 4567</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600">
                    123 Agricultural Plaza,<br />
                    Colombo 03, Sri Lanka<br />
                    10300
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-gray-50 p-20 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-700  shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
              {status && (
                <div className={`mt-4 text-center text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;