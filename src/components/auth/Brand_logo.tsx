export function BrandLogos() {
  const brands = [
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: "M" },
    { name: "Apple", logo: "A" },
    { name: "Amazon", logo: "A" }
  ]

  return (
    <div>
      <p className="text-blue-100 text-sm mb-4">Trusted by leading companies</p>
      <div className="flex space-x-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white font-bold"
          >
            {brand.logo}
          </div>
        ))}
      </div>
    </div>
  )
}