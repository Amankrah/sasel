import Link from "next/link";
import MemberCard from "@/components/MemberCard";
import { getMembers } from "@/sanity/lib/fetch";
import type { MemberTypeValue } from "@/sanity/lib/types";

export const revalidate = 60;

export const metadata = {
  title: "Our Team | SASEL Lab",
  description:
    "Meet the researchers, students, and staff of the Sustainable Agrifood Systems Engineering Lab at McGill University.",
};

const MEMBER_GROUPS: Array<{
  key: MemberTypeValue | 'PI_COMBINED';
  types: MemberTypeValue[];
  label: string;
  description: string;
}> = [
  { key: 'PI_COMBINED', types: ['PI', 'PROF'], label: 'Principal Investigator', description: 'Leading our research vision and strategy' },
  { key: 'SOFTWARE_ENG', types: ['SOFTWARE_ENG'], label: 'Software Development Team', description: 'Building the tools and platforms for our research' },
  { key: 'POSTDOC', types: ['POSTDOC'], label: 'Postdoctoral Fellows', description: 'Driving advanced research initiatives' },
  { key: 'PHD', types: ['PHD'], label: 'PhD Researchers', description: 'Conducting in-depth doctoral studies' },
  { key: 'MASTERS', types: ['MASTERS'], label: 'Masters Students', description: 'Developing specialized expertise' },
  { key: 'INTL_STUDENT', types: ['INTL_STUDENT'], label: 'International Students', description: 'Visiting and exchange students contributing to lab research' },
  { key: 'INTERN', types: ['INTERN'], label: 'Interns', description: 'Short-term interns gaining hands-on research experience' },
  { key: 'RA', types: ['RA'], label: 'Research Assistants', description: 'Supporting key research projects' },
  { key: 'ASSOC', types: ['ASSOC'], label: 'Research Associates', description: 'Contributing long-term expertise' },
  { key: 'STAFF', types: ['STAFF'], label: 'Staff', description: 'Essential lab operations and support' },
  { key: 'OTHER', types: ['OTHER'], label: 'Affiliates', description: 'Collaborators and visiting scholars' },
];

export default async function MembersPage() {
  const members = await getMembers();

  const active = members.filter((m) => m.isActive);
  const alumni = members.filter((m) => !m.isActive);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals driving innovation in sustainable agrifood systems engineering.
          </p>
        </div>

        {active.length > 0 && (
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col md:flex-row justify-around items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{active.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Active Members</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{alumni.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Alumni</div>
              </div>
              <div className="hidden md:block w-px h-16 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{active.length + alumni.length}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Total Members</div>
              </div>
            </div>
          </div>
        )}

        {MEMBER_GROUPS.map((group) => {
          const membersOfGroup = active.filter((m) => group.types.includes(m.memberType));
          if (membersOfGroup.length === 0) return null;
          const isPI = group.key === 'PI_COMBINED';

          return (
            <section key={group.key} className="mb-20">
              <div className="mb-10 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{group.label}</h2>
                <p className="text-gray-500">{group.description}</p>
              </div>

              {isPI ? (
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    {membersOfGroup.map((member) => (
                      <Link key={member._id} href={`/members/${member.slug.current}`}>
                        <MemberCard member={member} />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {membersOfGroup.map((member) => (
                    <Link key={member._id} href={`/members/${member.slug.current}`}>
                      <MemberCard member={member} />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {alumni.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Alumni</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {alumni.map((member) => (
                <Link key={member._id} href={`/members/${member.slug.current}`} className="block group">
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{member.position}</p>
                    {member.leftDate && (
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Class of {new Date(member.leftDate).getFullYear()}
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
