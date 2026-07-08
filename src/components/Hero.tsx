import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GradientBlinds from "./GradientBlinds";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0">
        <GradientBlinds
          gradientColors={["#0a0a0f", "#1c1c24", "#4a4a55", "#e8e8f0"]}
          angle={-35}
          blindCount={14}
          blindMinWidth={80}
          noise={0.06}
          spotlightRadius={0.9}
          spotlightSoftness={1.2}
          spotlightOpacity={0.55}
          mouseDampening={0.12}
          mixBlendMode="normal"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/80" />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 shadow-lg shadow-black/20 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-xs font-medium text-white/80">全新上线 · 为班级留住青春</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          珍藏每一段
          <br />
          青春时光
        </h1>

        <p className="mb-10 max-w-lg text-base text-white/60 sm:text-lg">
          用光影与文字，把高中三年的欢笑、泪水和成长，封存在属于你们班级的数字纪念册里。
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => navigate("/teachers")}
            className="h-12 rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
          >
            开始
          </Button>
          <Button
            asChild
            className="h-12 rounded-full border border-white/15 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <a
              href="https://github.com/ccwbb78/history"
              target="_blank"
              rel="noopener noreferrer"
            >
              了解更多
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
