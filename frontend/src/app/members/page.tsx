'use client';

import { useApi } from "@/lib/api/ApiContext";
import Image from "next/image";

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
    { key: 'PROF', label: 'Professors' },
    { key: 'POSTDOC', label: 'Postdoctoral Fellows' },
    { key: 'PHD', label: 'PhD Researchers' },
    { key: 'MASTERS', label: 'Masters Students' },
    { key: 'RA', label: 'Research Assistants' },
    { key: 'ASSOC', label: 'Research Associates' },
    { key: 'STAFF', label: 'Staff' },
    { key: 'OTHER', label: 'Others' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Team</h1>
      
      {Array.isArray(labMembers) ? (
        memberTypes.map(memberType => {
          const membersOfType = labMembers.filter(
            member => member.is_active && member.member_type === memberType.key
          );
          
          if (membersOfType.length === 0) return null;
          
          return (
            <section key={memberType.key} className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{memberType.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {membersOfType.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {member.image ? (
                      <div className="h-64 overflow-hidden relative">
                        <Image 
                          src={member.image} 
                          alt={member.name} 
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-200 flex items-center justify-center">
                        <svg 
                          className="w-32 h-32 text-gray-400" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                      <p className="text-gray-600 mb-3">{member.position}</p>
                      
                      {member.bio && (
                        <p className="text-gray-700 mb-4 line-clamp-3">{member.bio}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        {member.email && (
                          <a 
                            href={`mailto:${member.email}`} 
                            className="text-blue-600 hover:underline"
                          >
                            Email
                          </a>
                        )}
                        
                        {member.website && (
                          <a 
                            href={member.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No lab members found.</p>
        </div>
      )}
      
      {/* Alumni / Former Members */}
      {Array.isArray(labMembers) && labMembers.some(member => !member.is_active) && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Alumni</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labMembers
              .filter(member => !member.is_active)
              .map(member => (
                <li key={member.id} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  {member.left_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Until {new Date(member.left_date).getFullYear()}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
} 