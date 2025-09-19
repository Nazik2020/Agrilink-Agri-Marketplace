import { useState } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import axios from "axios";

const SellerSignupPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    businessName: "",
    businessDescription: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "First name is required";
    }
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = "Business description is required";
    } else if (formData.businessDescription.length < 10) {
      newErrors.businessDescription =
        "Business description must be at least 10 characters";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/SignupSeller.php",
        {
          userName: formData.userName,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          country: formData.country,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        setFormData({
          userName: "",
          businessName: "",
          businessDescription: "",
          country: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        });

        // Optional success feedback
        setTimeout(() => {
          // Navigation logic can be added here
        }, 3000);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen">
      <LeftSection />
      <RightSection
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        message={message}
      />
    </div>
  );
};

export default SellerSignupPage;
