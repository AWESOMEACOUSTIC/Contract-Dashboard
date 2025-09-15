import videoBackground from "../../../assets/Smooth Gradient.mp4"

export default function AuthHero() {
  return (
    <div className="w-full lg:w-[34.15vw] p-12 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoBackground} type="video/mp4" />
      </video>

      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />


      {/* Content */}
      <div className="relative z-10">
        <p className="text-md font-bold mb-4 text-[#c9bbdf] leading-5">
          You can easily
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-8 text-white">
          Speed up your work
          <br />
          with our Web App
        </h1>
      </div>
    </div>
  )
}