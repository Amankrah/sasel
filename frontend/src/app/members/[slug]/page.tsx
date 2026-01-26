'use client';

import { useApi } from "@/lib/api/ApiContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, use } from "react";
import { LabMember, Publication } from "@/lib/api/types";
import Pagination from "@/components/Pagination";

export default function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params using Recat.use()
    const { slug } = use(params);

    const { labMembers, publications, loading, error } = useApi();
    const [member, setMember] = useState<LabMember | null>(null);
    const [memberPublications, setMemberPublications] = useState<Publication[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Find member and their publications once data is loaded
    useEffect(() => {
        if (labMembers && publications) {
            const foundMember = labMembers.find(m => m.slug === slug);
            if (foundMember) {
                setMember(foundMember);

                // Filter publications where this member is an author
                // We verify by name since that's what we have available in the authors list usually
                const pubs = publications.filter(pub => {
                    if (!Array.isArray(pub.authors)) return false;
                    return pub.authors.some((author: any) => author.name === foundMember.name);
                });

                // Sort by year desc
                pubs.sort((a, b) => {
                    if (b.year !== a.year) return b.year - a.year;
                    return (b.month || 0) - (a.month || 0);
                });

                setMemberPublications(pubs);
            }
        }
    }, [labMembers, publications, slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || (labMembers && !member)) {
        // If we loaded members but didn't find the slug, show 404-like state
        if (labMembers && !member) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Member Not Found</h1>
                    <Link href="/members" className="text-blue-600 hover:underline">← Back to Members</Link>
                </div>
            )
        }
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-700">{error?.message || "Something went wrong"}</p>
            </div>
        );
    }

    if (!member) return null; // Should be handled by useEffect or loading state

    // Pagination Logic
    const totalPages = Math.ceil(memberPublications.length / itemsPerPage);
    const paginatedPublications = memberPublications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                        {/* Image */}
                        <div className="shrink-0 relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    <span className="text-slate-400 text-6xl font-bold">{member.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
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
                                {member.google_scholar_id && (
                                    <a href={`https://scholar.google.com/citations?user=${member.google_scholar_id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
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

                    {/* Left Column: Bio & Info */}
                    <div className="md:col-span-2 space-y-12">
                        {member.bio && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">Biography</h2>
                                <div className="prose max-w-none text-gray-700 leading-relaxed">
                                    {member.bio}
                                </div>
                            </section>
                        )}

                        {/* Publications Section */}
                        {memberPublications.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-4">Recent Publications</h2>
                                <div className="space-y-4">
                                    {paginatedPublications.map(pub => (
                                        <div key={pub.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2">{pub.title}</h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {pub.journal || pub.conference || "Publication"} • {pub.year}
                                            </p>
                                            <div className="flex gap-2">
                                                {pub.doi && (
                                                    <a href={`https://doi.org/${pub.doi}`} target="_blank" className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-wider">DOI</a>
                                                )}
                                                {pub.url && (
                                                    <a href={pub.url} target="_blank" className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Link</a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar (if we had more structured data like Interests, it would go here) */}
                    <div>
                        {/* For now, maybe just "Featured Projects" if we had them linked, or just empty space to balance layout */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                            <h3 className="font-bold text-gray-900 mb-4">Affiliation</h3>
                            <p className="text-gray-700">SASEL Lab</p>
                            <p className="text-gray-600 text-sm">McGill University</p>
                            {member.left_date && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm font-medium text-gray-500">Alumni</p>
                                    <p className="text-gray-700">Until {new Date(member.left_date).getFullYear()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

