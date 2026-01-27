import Image from "next/image";
import { LabMember } from "@/lib/api/types";

interface MemberCardProps {
  member: LabMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-green-400/10"></div>

      {/* Member Image */}
      {member.image ? (
        <div className="h-64 w-full overflow-hidden relative bg-gray-100">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center"
            priority={false}
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

        {/* Contact Links removed to prevent nested <a> tags since the whole card is a link */}
        <div className="mt-4 flex items-center text-blue-500 font-medium text-sm group-hover:text-blue-600">
          <span>View Profile</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
