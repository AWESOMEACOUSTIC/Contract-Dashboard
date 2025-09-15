import { useState } from "react"
import { SocialLoginButtons } from "../../auth/Scoial_Login"
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
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
          {success}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("name", e.target.value)}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("email", e.target.value)}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          disabled={isLoading}
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Forgot Password?
          </button>
        </div>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("password", e.target.value)}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the{" "}
          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
            Terms & Policy
          </button>
          <span className="text-red-500"> *</span>
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <p className="text-center text-sm text-gray-600">
        Have an account?{" "}
        <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </button>
      </p>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLoginButtons />
    </form>
  )
}