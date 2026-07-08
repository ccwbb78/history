import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DomeGallery from '@/components/DomeGallery';
import { getRegisteredName, canAccessMan } from '@/lib/auth';

function loadImages(): { src: string; alt: string }[] {
  const modules = import.meta.glob('/0/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
  return Object.entries(modules).map(([path, src]) => {
    const name = path.split('/').pop() || 'photo';
    return { src, alt: name };
  });
}

export default function Man() {
  const navigate = useNavigate();
  const registeredName = getRegisteredName();
  const images = loadImages();

  if (!registeredName) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-semibold">请先注册</h1>
        <p className="mb-8 text-white/60">该页面仅限已注册用户访问。</p>
        <button
          onClick={() => navigate('/checking')}
          className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          去注册
        </button>
      </main>
    );
  }

  if (!canAccessMan()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-semibold">无权访问</h1>
        <p className="mb-2 text-white/60">抱歉，你的姓名不在允许访问此页面的名单内。</p>
        <p className="mb-8 text-sm text-white/40">当前登录：{registeredName}</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full border border-white/20 bg-transparent px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10"
        >
          返回首页
        </button>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      <div className="absolute left-4 top-4 z-50 md:left-8 md:top-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </button>
      </div>
      <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2">
        <button
          onClick={() => navigate('/end')}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-8 py-2 text-sm font-semibold text-black shadow transition-all hover:scale-105 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          结束
        </button>
      </div>

      {images.length > 0 ? (
        <DomeGallery
          images={images}
          fit={0.75}
          grayscale={false}
          overlayBlurColor="#0a0a0f"
          openedImageWidth="min(80vw, 600px)"
          openedImageHeight="min(80vh, 800px)"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/60">未找到照片素材</div>
      )}
    </main>
  );
}
