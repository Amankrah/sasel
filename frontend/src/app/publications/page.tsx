import { getPublications } from '@/sanity/lib/fetch';
import PublicationsList from '@/components/PublicationsList';

export const revalidate = 60;

export const metadata = {
  title: 'Publications | SASEL Lab',
  description:
    'Explore our research contributions in sustainable agrifood systems and environmental nutrition.',
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Publications
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our research contributions in sustainable agrifood systems and environmental nutrition
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4"></div>
        </div>

        <PublicationsList publications={publications} />
      </div>
    </div>
  );
}
