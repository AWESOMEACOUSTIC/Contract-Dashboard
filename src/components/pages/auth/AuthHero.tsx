import { BrandLogos } from "../../auth/Brand_logo"

export default function AuthHero() {
  return (
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-700 to-blue-800 p-12 flex flex-col justify-between relative overflow-hidden min-h-[600px]">
      {/* Background Pattern Overlay */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 bg-opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 bg-opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <p className="text-sm font-medium mb-4 text-blue-100 leading-5">
          You can easily
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-8 text-white">
          Speed up your work
          <br />
          with our Web App
        </h1>
      </div>

      <div className="relative z-10">
        <BrandLogos />
      </div>
    </div>
  )
}