import LoginForm from "./LoginForm"

interface FormData {
  name: string
  email: string
  password: string
  agreeToTerms: boolean
}

interface AuthFormProps {
  formData: FormData
  onInputChange: (field: string, value: string | boolean) => void
}

export default function AuthForm({ formData, onInputChange }: AuthFormProps) {
  return (
    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
      <div className="max-w-sm mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started Now</h2>
        <p className="text-gray-600 mb-8">Please log in to your account to continue.</p>
        
        <LoginForm formData={formData} onInputChange={onInputChange} />
      </div>
    </div>
  )
}