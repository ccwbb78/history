import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextTrail from "@/components/TextTrail";
import Noise from "@/components/Noise";
import { canAccessMan } from "@/lib/auth";
import namesRaw from "../../name.txt?raw";

const names = namesRaw
  .split(/\s+/)
  .map((n) => n.trim())
  .filter(Boolean);

export default function Students() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(canAccessMan() ? '/man' : '/end');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0f]">
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={18}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 md:px-6 md:pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>
      </div>

      <div className="relative z-0 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="pointer-events-none mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          同学名录
        </h1>
        <p className="pointer-events-none mb-8 max-w-md text-sm text-white/50 md:text-base">
          在屏幕中滑动手指或鼠标，随机出现的名字会化作一道道青春拖尾。
        </p>
        <div className="absolute inset-0">
          <TextTrail items={names} variant={1} />
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-10">
        <button
          onClick={handleNext}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-8 py-2 text-sm font-semibold text-black shadow transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
