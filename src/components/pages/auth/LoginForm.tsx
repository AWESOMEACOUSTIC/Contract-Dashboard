import { SocialLoginButtons } from "../../auth/Scoial_Login"

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange("email", e.target.value)}
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
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
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the{" "}
          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
            Terms & Policy
          </button>
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Log in
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