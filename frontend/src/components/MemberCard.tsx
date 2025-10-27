import Image from "next/image";
import { LabMember } from "@/lib/api/types";

interface MemberCardProps {
  member: LabMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-green-400/10"></div>

      {/* Member Image */}
      {member.image ? (
        <div className="h-64 overflow-hidden relative">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-green-500/30 flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-32 h-32 text-white/70"
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

      {/* Member Info */}
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
        <p className="text-gray-700 font-medium mb-3">{member.position}</p>

        {member.bio && (
          <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Contact Links */}
        <div className="flex flex-wrap gap-3 mt-4">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center px-4 py-2 backdrop-blur-sm bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          )}

          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 backdrop-blur-sm bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-all shadow-md hover:shadow-lg text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
