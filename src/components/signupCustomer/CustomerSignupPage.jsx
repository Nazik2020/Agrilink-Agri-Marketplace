"use client"

import { useState } from "react"
import LeftSection from "./LeftSection"
import RightSection from "./RightSection"
import axios from "axios"

const CustomerSignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.post(
        "http://localhost/backend/SignupCustomer.php",
        {
          fullName: formData.fullName,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }
      )
      setMessage(res.data.message)
      if (res.data.success) {
        setFormData({
          fullName: "",
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-screen ">
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
  )
}

export default CustomerSignupPage
