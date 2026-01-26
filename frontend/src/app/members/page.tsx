'use client';

import { useApi } from "@/lib/api/ApiContext";
import MemberCard from "@/components/MemberCard";
import Link from "next/link";

export default function MembersPage() {
  const { labMembers, loading, error } = useApi();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Team</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
      </div>
    );
  }

  // Group members by type
  const memberTypes = [
    {
      key: 'PROF',
      label: 'Principal Investigator',
      description: "Leading our research vision and strategy"
    },
    {
      key: 'SOFTWARE_ENG',
      label: 'Software Development Team',
      description: "Building the tools and platforms for our research"
    },
    {
      key: 'POSTDOC',
      label: 'Postdoctoral Fellows',
      description: "Driving advanced research initiatives"
    },
    {
      key: 'PHD',
      label: 'PhD Researchers',
      description: "Conducting in-depth doctoral studies"
    },
    {
      key: 'MASTERS',
      label: 'Masters Students',
      description: "Developing specialized expertise"
    },
    {
      key: 'RA',
      label: 'Research Assistants',
      description: "Supporting key research projects"
    },
    {
      key: 'ASSOC',
      label: 'Research Associates',
      description: "Contributing long-term expertise"
    },
    {
      key: 'STAFF',
      label: 'Staff',
      description: "Essential lab operations and support"
    },
    {
      key: 'OTHER',
      label: 'Affiliates',
      description: "Collaborators and visiting scholars"
    },
  ];

  // Calculate team statistics
  const activeMembers = Array.isArray(labMembers) ? labMembers.filter(m => m.is_active) : [];
  const alumniMembers = Array.isArray(labMembers) ? labMembers.filter(m => !m.is_active) : [];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals driving innovation in sustainable agrifood systems engineering.
          </p>
        </div>

        {/* Team Statistics */}
        {activeMembers.length > 0 && (
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col md:flex-row justify-around items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{activeMembers.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Active Members</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{alumniMembers.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Alumni</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{activeMembers.length + alumniMembers.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Total Members</div>
              </div>
            </div>
          </div>
        )}

        {Array.isArray(labMembers) ? (
          memberTypes.map(memberType => {
            const membersOfType = labMembers.filter(
              member => member.is_active && member.member_type === memberType.key
            );

            if (membersOfType.length === 0) return null;

            // Special layout for Principal Investigator (single person)
            const isPrincipalInvestigator = memberType.key === 'PROF';

            return (
              <section key={memberType.key} className="mb-20">
                {/* Section Header */}
                <div className="mb-10 border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {memberType.label}
                  </h2>
                  <p className="text-gray-500">{memberType.description}</p>
                </div>

                {/* Members Layout - Single centered card for PI, grid for others */}
                {isPrincipalInvestigator ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      {membersOfType.map(member => (
                        <Link key={member.id} href={`/members/${member.slug}`}>
                          <MemberCard member={member} />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {membersOfType.map(member => (
                      <Link key={member.id} href={`/members/${member.slug}`}>
                        <MemberCard member={member} />
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className="text-center py-20 text-gray-500">
            No team members found.
          </div>
        )}

        {/* Alumni / Former Members */}
        {Array.isArray(labMembers) && alumniMembers.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Alumni
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {alumniMembers.map(member => (
                <Link key={member.id} href={`/members/${member.slug}`} className="block group">
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{member.position}</p>
                    {member.left_date && (
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Class of {new Date(member.left_date).getFullYear()}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 