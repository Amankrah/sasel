export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="h-12 w-96 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/60 rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-4/5 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
