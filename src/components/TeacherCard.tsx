import { useState } from "react";
import type { Teacher } from "@/data/teachers";

interface TeacherCardProps {
  teacher: Teacher;
  index: number;
}

export function TeacherCard({ teacher, index }: TeacherCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const rotations = [-4, 2, -2, 3, -3];
  const tops = [0, 12, 6, 16, 8];
  const baseRotation = rotations[index % rotations.length];
  const topOffset = tops[index % tops.length];

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ marginTop: `${topOffset}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wall pin */}
      <div className="absolute -top-28 z-20 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-sm ring-1 ring-black/20" />

      {/* Lanyard string */}
      <div
        className="absolute -top-28 h-28 w-0.5 origin-top bg-gradient-to-b from-zinc-400/60 via-zinc-300/40 to-zinc-200/30"
        style={{
          transform: `rotate(${baseRotation * 0.6}deg)`,
        }}
      />

      {/* Metal clip */}
      <div className="relative z-10 -mb-3 flex h-6 w-10 flex-col items-center justify-end rounded-b-md bg-gradient-to-b from-zinc-200 to-zinc-400 shadow-md">
        <div className="mb-0.5 h-1.5 w-7 rounded-full bg-zinc-600" />
        <div className="absolute -top-1 h-3 w-6 rounded-t-md bg-gradient-to-b from-zinc-300 to-zinc-500" />
      </div>

      {/* Card */}
      <div
        className="relative w-52 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: isHovered
            ? `rotate(0deg) translateY(-8px) scale(1.03)`
            : `rotate(${baseRotation}deg)`,
          transformOrigin: "top center",
        }}
      >
        {/* Header color bar */}
        <div className={`h-20 bg-gradient-to-br ${teacher.color} p-4`}>
          <div className="flex h-full items-end justify-end">
            <span className="text-3xl font-bold text-white/30">{teacher.initials}</span>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative -mt-10 flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${teacher.color} text-2xl font-bold text-white shadow-lg`}
          >
            {teacher.initials}
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pb-6 pt-3 text-center">
          <h3 className="text-xl font-bold text-zinc-900">{teacher.name}</h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {teacher.subject} · {teacher.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            “{teacher.quote}”
          </p>
        </div>

        {/* Soft shadow */}
        <div className="absolute bottom-2 right-2 h-16 w-16 rounded-full bg-gradient-to-tl from-black/5 to-transparent" />
      </div>
    </div>
  );
}
