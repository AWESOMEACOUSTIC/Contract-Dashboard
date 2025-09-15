"use client"

import { useState } from "react"
import AuthHero from "./AuthHero"
import AuthForm from "./AuthForm"

export default function Login_Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "workmail@gmail.com",
    password: "",
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="w-full max-w-[100%] shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        <AuthHero />
        <AuthForm formData={formData} onInputChange={handleInputChange} />
      </div>
    </div>
  )
}