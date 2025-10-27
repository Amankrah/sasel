'use client';

import { useApi } from "@/lib/api/ApiContext";
import MemberCard from "@/components/MemberCard";

export default function MembersPage() {
  const { labMembers, loading, error } = useApi();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-4">
          There was an error loading the team members. Please try again later.
        </p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  // Group members by type
  const memberTypes = [
    { key: 'PROF', label: 'Principal Investigator' },
    { key: 'SOFTWARE_ENG', label: 'Software Development Team' },
    { key: 'POSTDOC', label: 'Postdoctoral Fellows' },
    { key: 'PHD', label: 'PhD Researchers' },
    { key: 'MASTERS', label: 'Masters Students' },
    { key: 'RA', label: 'Research Assistants' },
    { key: 'ASSOC', label: 'Research Associates' },
    { key: 'STAFF', label: 'Staff' },
    { key: 'OTHER', label: 'Others' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Meet the talented individuals driving innovation in sustainable agrifood systems engineering
          </p>
        </div>

        {Array.isArray(labMembers) ? (
          memberTypes.map(memberType => {
            const membersOfType = labMembers.filter(
              member => member.is_active && member.member_type === memberType.key
            );

            if (membersOfType.length === 0) return null;

            // Special handling for Principal Investigator (single member, centered)
            const isPrincipalInvestigator = memberType.key === 'PROF';
            const gridClass = isPrincipalInvestigator
              ? "flex justify-center"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";

            return (
              <section key={memberType.key} className="mb-16">
                <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-6 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 text-center">{memberType.label}</h2>
                </div>
                <div className={gridClass}>
                  {membersOfType.map(member => (
                    <div key={member.id} className={isPrincipalInvestigator ? "w-full max-w-md" : ""}>
                      <MemberCard member={member} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <p className="text-gray-700">No lab members found.</p>
            </div>
          </div>
        )}

        {/* Alumni / Former Members */}
        {Array.isArray(labMembers) && labMembers.some(member => !member.is_active) && (
          <section className="mt-16">
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-6 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900">Alumni</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labMembers
                .filter(member => !member.is_active)
                .map(member => (
                  <div key={member.id} className="backdrop-blur-md bg-white/40 border border-white/60 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">{member.position}</p>
                    {member.left_date && (
                      <p className="text-xs text-gray-600 mt-2">
                        Until {new Date(member.left_date).getFullYear()}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 