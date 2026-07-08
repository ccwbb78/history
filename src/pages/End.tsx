import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import TiltedCard from '@/components/TiltedCard';
import gradPhoto from '/0/1.webp';

export default function End() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 py-20 text-center text-white">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <span className="text-2xl">🎓</span>
      </div>
      <h1 className="mb-4 text-3xl font-semibold md:text-4xl">回忆已珍藏</h1>
      <p className="mb-8 max-w-md text-white/60">
        感谢你的驻足，愿这段青春记忆永远闪耀。
      </p>

      <div className="mb-10 w-full max-w-2xl">
        <TiltedCard
          imageSrc={gradPhoto}
          altText="毕业合照"
          captionText="毕业快乐"
          containerHeight="400px"
          containerWidth="100%"
          imageHeight="400px"
          imageWidth="100%"
          rotateAmplitude={12}
          scaleOnHover={1.05}
          showMobileWarning={false}
          showTooltip={true}
        />
      </div>

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-8 py-2 text-sm font-semibold text-black shadow transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Home className="h-4 w-4" />
        返回主页
      </button>
    </main>
  );
}
