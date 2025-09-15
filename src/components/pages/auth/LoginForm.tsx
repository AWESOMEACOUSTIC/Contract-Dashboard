import { useState } from "react"
import { useAuth } from "../../../contexts/AuthContext"

interface FormData {
  name: string
  email: string
  password: string
  agreeToTerms: boolean
}

interface LoginFormProps {
  formData: FormData
  onInputChange: (field: string, value: string | boolean) => void
}

export default function LoginForm({ formData, onInputChange }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms & Policy")
      return
    }

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        setSuccess(result.message)
        // Navigation to dashboard will be implemented later
        console.log("Login successful! Ready for dashboard navigation.")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-300 bg-red-900/20 border border-red-700/50 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 text-sm text-green-300 bg-green-900/20 border border-green-700/50 rounded-lg">
          {success}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("name", e.target.value)}
          className="w-full h-12 px-4 bg-[#181820] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c6a9f5] focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
          disabled={isLoading}
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email address <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("email", e.target.value)}
          className="w-full h-12 px-4 bg-[#181820] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c6a9f5] focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
          disabled={isLoading}
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password <span className="text-red-400">*</span>
          </label>
          <button type="button" className="text-sm text-[#c6a9f5] hover:text-[#d7c2f9] font-medium">
            Forgot Password?
          </button>
        </div>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("password", e.target.value)}
          className="w-full h-12 px-4 bg-[#181820] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c6a9f5] focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
          disabled={isLoading}
          required
          placeholder="Use 'test123' for demo"
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          id="terms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("agreeToTerms", e.target.checked)}
          className="w-4 h-4 text-[#c6a9f5] bg-[#181820] border-gray-700 rounded focus:ring-[#c6a9f5] focus:ring-2"
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-gray-300">
          I agree to the{" "}
          <button type="button" className="text-[#c6a9f5] hover:text-[#d7c2f9] font-medium">
            Terms & Policy
          </button>
          <span className="text-red-400"> *</span>
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-[#a877f8] text-white to-[#4601b4] 
        hover:from-[#b899f3] hover:to-[#cbb3f7] disabled:opacity-50 disabled:cursor-not-allowed hover:text-black font-bold
        rounded-lg transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0a0b1e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-400">
        Have an account?{" "}
        <button type="button" className="text-[#c6a9f5] hover:text-[#d7c2f9] font-medium">
          Sign up
        </button>
      </p>
    </form>
  )
}