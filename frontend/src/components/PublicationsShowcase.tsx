'use client';

import Link from "next/link";

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal?: string;
  conference?: string;
  year: number;
  citations?: number;
  url?: string;
  doi?: string;
}

export default function PublicationsShowcase() {
  // Scholar Metrics (from Google Scholar)
  const scholarMetrics = {
    totalCitations: 978,
    hIndex: 18,
    i10Index: 32,
    citationsSince2020: 852
  };

  // Featured Publications from Google Scholar
  const featuredPublications: Publication[] = [
    {
      id: 1,
      title: "Water Scrubbing: A Better Option for Biogas Purification for Effective Storage",
      authors: "C Ofori-Boateng, EM Kwofie",
      journal: "World Applied Sciences Journal 5 (Special Issue for Environment), 122-125",
      year: 2009,
      citations: 82
    },
    {
      id: 2,
      title: "A review of rice parboiling systems, energy supply, and consumption",
      authors: "EM Kwofie, M Ngadi",
      journal: "Renewable and Sustainable Energy Reviews 72, 465-472",
      year: 2017,
      citations: 80
    },
    {
      id: 3,
      title: "Overview of single cell protein: Production pathway, sustainability outlook, and digital twin potentials",
      authors: "R Aidoo, EM Kwofie, P Adewale, E Lam, M Ngadi",
      journal: "Trends in Food Science & Technology 138, 577-598",
      year: 2023,
      citations: 57
    },
    {
      id: 4,
      title: "Advances in legume protein extraction technologies: A review",
      authors: "CR Eze, EM Kwofie, P Adewale, E Lam, M Ngadi",
      journal: "Innovative Food Science & Emerging Technologies 82, 103199",
      year: 2022,
      citations: 57
    },
    {
      id: 5,
      title: "Plant-based dietary shift: Current trends, barriers, and carriers",
      authors: "V Abe-Inge, R Aidoo, MM de la Fuente, EM Kwofie",
      journal: "Trends in Food Science & Technology 143, 104292",
      year: 2024,
      citations: 50
    }
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Publications & Research Impact
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Advancing knowledge in sustainable food systems, environmental nutrition, and circular bioeconomy
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Scholar Metrics Cards */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Citations */}
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {scholarMetrics.totalCitations}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wider text-sm">
                Total Citations
              </div>
              <div className="text-xs text-gray-500 mt-2">
                📚 All time
              </div>
            </div>

            {/* Citations Since 2020 */}
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {scholarMetrics.citationsSince2020}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wider text-sm">
                Citations
              </div>
              <div className="text-xs text-gray-500 mt-2">
                📈 Since 2020
              </div>
            </div>

            {/* h-index */}
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {scholarMetrics.hIndex}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wider text-sm">
                h-index
              </div>
              <div className="text-xs text-gray-500 mt-2">
                🎯 Impact metric
              </div>
            </div>

            {/* i10-index */}
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {scholarMetrics.i10Index}
              </div>
              <div className="text-gray-600 font-semibold uppercase tracking-wider text-sm">
                i10-index
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ⭐ Publications with 10+ citations
              </div>
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Research Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 backdrop-blur-sm bg-blue-100/60 border border-blue-200/60 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                🌾 Agrifood Systems Sustainability
              </span>
              <span className="px-4 py-2 backdrop-blur-sm bg-green-100/60 border border-green-200/60 text-green-800 rounded-full text-sm font-medium shadow-sm">
                ♻️ Circular Economy Analysis
              </span>
              <span className="px-4 py-2 backdrop-blur-sm bg-purple-100/60 border border-purple-200/60 text-purple-800 rounded-full text-sm font-medium shadow-sm">
                🥗 Environmental Nutrition
              </span>
              <span className="px-4 py-2 backdrop-blur-sm bg-amber-100/60 border border-amber-200/60 text-amber-800 rounded-full text-sm font-medium shadow-sm">
                🏭 Industrial Eco-efficiency
              </span>
            </div>
          </div>
        </div>

        {/* Featured Publications */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Publications
          </h3>
          <div className="space-y-4">
            {featuredPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                        {pub.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{pub.authors}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {pub.journal && (
                          <span className="text-gray-700 font-medium">
                            📖 {pub.journal}
                          </span>
                        )}
                        {pub.conference && (
                          <span className="text-gray-700 font-medium">
                            🎤 {pub.conference}
                          </span>
                        )}
                        <span className="text-gray-600">📅 {pub.year}</span>
                        {pub.citations !== undefined && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            📊 {pub.citations} citations
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md"
                        >
                          View
                        </a>
                      )}
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium shadow-md"
                        >
                          DOI
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action Links */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Scholar Link */}
            <a
              href="https://scholar.google.com/citations?user=QyKOR3oAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="group backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm1-15h-2v6h2V7zm0 8h-2v2h2v-2z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Google Scholar Profile</h4>
                <p className="text-gray-600 text-sm">
                  View complete publication list and citation metrics
                </p>
              </div>
            </a>

            {/* All Publications Link */}
            <Link
              href="/publications"
              className="group backdrop-blur-md bg-white/50 border border-white/60 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">All Publications</h4>
                <p className="text-gray-600 text-sm">
                  Browse our complete publication archive
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
