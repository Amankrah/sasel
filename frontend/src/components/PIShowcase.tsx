'use client';

import Image from "next/image";

export default function PIShowcase() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Gradient Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Principal Investigator
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto"></div>
        </div>

        {/* Main PI Card */}
        <div className="max-w-6xl mx-auto backdrop-blur-lg bg-white/50 border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Photo and Quick Info */}
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col items-center justify-center text-white">
              <div className="mb-6 relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/images/pi/ebenezer-kwofie.jpg"
                  alt="Dr. Ebenezer Miezah Kwofie"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Ebenezer Miezah Kwofie, Ph.D.
              </h3>
              <p className="text-blue-100 text-center mb-6 text-lg">
                Assistant Professor
              </p>

              {/* Quick Stats */}
              <div className="w-full space-y-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">🏆</div>
                  <p className="text-sm mt-2">Distinguished Young Alumni Award 2021</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">🌍</div>
                  <p className="text-sm mt-2">International Projects across 5+ Countries</p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="w-full space-y-3">
                <a
                  href="mailto:ebenezer.kwofie@mcgill.ca"
                  className="flex items-center justify-center w-full px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
                <a
                  href="https://scholar.google.com/citations?hl=en&user=QyKOR3oAAAAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white rounded-lg hover:bg-white/30 transition font-medium"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm1-15h-2v6h2V7zm0 8h-2v2h2v-2z"/>
                  </svg>
                  Google Scholar
                </a>
                <a
                  href="https://www.mcgill.ca/bioeng/kwofie-ebenezer-miezah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white rounded-lg hover:bg-white/30 transition font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  McGill Profile
                </a>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 p-8 md:p-12">
              {/* Bio */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">About</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dr. Ebenezer Miezah Kwofie is an Assistant Professor in the Department of Bioresource Engineering at McGill University and Co-director of the Integrated Food and Bioprocess Engineering Program. His research focuses on advancing sustainable and resilient food systems through innovative engineering solutions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  With extensive international experience managing food systems development projects across Africa and Latin America, Dr. Kwofie brings a global perspective to addressing critical challenges in food security, nutrition, and environmental sustainability.
                </p>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Education</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Ph.D., Bioresource Engineering</p>
                      <p className="text-gray-600">McGill University</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">M.Sc., Industrial Engineering</p>
                      <p className="text-gray-600">University of Borås, Sweden</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">B.Sc., Chemical Engineering</p>
                      <p className="text-gray-600">Kwame Nkrumah University of Science and Technology, Ghana</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Research Interests</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Food System Sustainability & Resilience</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Industrial Agrifood Eco-Efficiency</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Life Cycle Sustainability Assessments</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Circular Economy Pathways</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Decision Support Systems</span>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Sustainable Healthy Diets</span>
                  </div>
                </div>
              </div>

              {/* Awards & Recognition */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Awards & Recognition</h4>
                <div className="space-y-3">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-gray-900">Distinguished Young Alumni Award</p>
                    <p className="text-sm text-gray-600">Macdonald Campus, McGill University - 2021</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-gray-900">CIBC Fellowship Award</p>
                    <p className="text-sm text-gray-600">2015</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-gray-900">Multiple Presentation Awards</p>
                    <p className="text-sm text-gray-600">Northeast Agricultural and Biological Engineering Conference</p>
                  </div>
                </div>
              </div>

              {/* Professional Experience Highlight */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-3">International Impact</h4>
                <p className="text-gray-700 mb-3">
                  Dr. Kwofie has managed International Food Systems Development projects across multiple continents (2016-2020), working in:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm">
                    🇿🇲 Zambia
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm">
                    🇲🇼 Malawi
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm">
                    🇪🇹 Ethiopia
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm">
                    🇧🇴 Bolivia
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 shadow-sm">
                    🇭🇳 Honduras
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info - Teaching & Leadership */}
        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teaching */}
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900">Teaching</h4>
            </div>
            <ul className="space-y-2">
              <li className="text-gray-800">📚 BREE 205: Engineering Design 1</li>
              <li className="text-gray-800">🔧 BREE 216: Bioresource Engineering Materials</li>
              <li className="text-gray-800">🌍 AGRI 493: International Project Management</li>
            </ul>
          </div>

          {/* Leadership Roles */}
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900">Leadership</h4>
            </div>
            <ul className="space-y-2">
              <li className="text-gray-800">👨‍🏫 Co-director, Integrated Food and Bioprocess Engineering Program</li>
              <li className="text-gray-800">🎓 Previous Joint Appointment, University of Arkansas</li>
              <li className="text-gray-800">🏛️ Department of Bioresource Engineering, McGill University</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
