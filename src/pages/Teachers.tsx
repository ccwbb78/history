import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Lanyard from "@/components/Lanyard";
import LightRays from "@/components/LightRays";

const teachers = [
  { id: 1, name: "占老师", subject: "数学老师", front: "/teachers/teacher-1.webp" },
  { id: 2, name: "张老师", subject: "语文老师", front: "/teachers/teacher-2.webp" },
  { id: 3, name: "李老师", subject: "英语老师", front: "/teachers/teacher-3.webp" },
  { id: 4, name: "张r", subject: "物理老师", front: "/teachers/teacher-4.webp" },
  { id: 5, name: "舒老师", subject: "化学老师", front: "/teachers/teacher-5.webp" },
  { id: 6, name: "吴老师", subject: "生物老师", front: "/teachers/teacher-6.webp" },
];

export default function Teachers() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  // Lanyard 内部自带 isMobile 检测，这里只用于布局微调
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const goTo = (index: number) =>
    setCurrentIndex(Math.max(0, Math.min(teachers.length - 1, index)));
  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) < 50) return;
    diff > 0 ? next() : prev();
  };

  const teacher = teachers[currentIndex];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      {/* Header */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-8">
        <div className="mb-2 flex items-center justify-between md:mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回主页
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white/90 md:mt-10 md:text-3xl">教职工风采墙</h1>
          <div className="w-24" />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative z-10 flex flex-1 items-center justify-center pb-4 pt-2 md:pb-8 md:pt-6">
        {/* Slide */}
        <div
          key={teacher.id}
          className="relative h-full w-full animate-in fade-in duration-500"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Lanyard
            frontImage={teacher.front}
            position={isMobile ? [0, 0, 11] : [0, 0, 18]}
            gravity={[0, -30, 0]}
            fov={isMobile ? 30 : 22}
            lanyardWidth={isMobile ? 0.5 : 1.2}
            transparent={false}
          />
        </div>

        {/* Prev button */}
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label="上一个"
          className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 md:left-8"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next button */}
        <button
          onClick={next}
          disabled={currentIndex === teachers.length - 1}
          aria-label="下一个"
          className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 md:right-8"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Next step button on last slide */}
        {currentIndex === teachers.length - 1 && (
          <button
            onClick={() => navigate('/students')}
            className="absolute bottom-28 left-1/2 z-20 inline-flex -translate-x-1/2 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-8 py-2 text-sm font-semibold text-black shadow transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            下一步
          </button>
        )}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {teachers.map((t, i) => (
            <button
              key={t.id}
              onClick={() => goTo(i)}
              aria-label={`查看 ${t.name}`}
              className={`h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Name label */}
        <div className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 text-center">
          <p className="text-lg font-medium text-white/90">{teacher.name}</p>
          <p className="text-sm text-white/60">{teacher.subject}</p>
          <p className="text-xs text-white/40">
            {currentIndex + 1} / {teachers.length}
          </p>
        </div>
      </div>

      {/* Top-down lighting overlay */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff5e0"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.08}
          distortion={0.04}
        />
      </div>
    </div>
  );
}
