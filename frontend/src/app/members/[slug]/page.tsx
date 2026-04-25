import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { getMemberBySlug, getMembers, getPublications } from '@/sanity/lib/fetch';
import { urlForImage } from '@/sanity/lib/image';
import MemberPublicationsList from '@/components/MemberPublicationsList';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const members = await getMembers();
  return members.map((m) => ({ slug: m.slug.current }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) return { title: 'Member Not Found | SASEL Lab' };
  return {
    title: `${member.name} | SASEL Lab`,
    description: member.position,
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const [member, publications] = await Promise.all([
    getMemberBySlug(slug),
    getPublications(),
  ]);

  if (!member) notFound();

  const memberPublications = publications
    .filter((pub) => pub.authors?.some((a) => a._id === member._id))
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return (b.month || 0) - (a.month || 0);
    });

  const imageUrl = member.image ? urlForImage(member.image).width(800).url() : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div className="shrink-0 relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
              {imageUrl ? (
                <Image src={imageUrl} alt={member.image?.alt || member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-6xl font-bold">{member.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{member.name}</h1>
              <p className="text-xl text-blue-600 font-medium mb-6">{member.position}</p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                    Email
                  </a>
                )}
                {member.website && (
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                    Website
                  </a>
                )}
                {member.googleScholarId && (
                  <a href={`https://scholar.google.com/citations?user=${member.googleScholarId}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                    Google Scholar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            {member.bio && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">Biography</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <PortableText value={member.bio} />
                </div>
              </section>
            )}

            {memberPublications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-4">
                  Recent Publications
                </h2>
                <MemberPublicationsList publications={memberPublications} />
              </section>
            )}
          </div>

          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Affiliation</h3>
              <p className="text-gray-700">SASEL Lab</p>
              <p className="text-gray-600 text-sm">McGill University</p>
              {member.leftDate && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-500">Alumni</p>
                  <p className="text-gray-700">Until {new Date(member.leftDate).getFullYear()}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Link href="/members" className="text-blue-600 hover:underline">
                ← Back to Members
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
