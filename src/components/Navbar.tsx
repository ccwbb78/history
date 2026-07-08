import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isRegistered, logout } from "@/lib/auth";

export function Navbar() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(() => isRegistered());

  const handleLogout = () => {
    logout();
    setRegistered(false);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-5 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl md:left-8 md:right-8 md:px-6">
      <span className="text-lg font-semibold tracking-tight text-white">回忆</span>

      <nav className="flex items-center gap-5 md:gap-7">
        <Link
          to="/man"
          className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
        >
          特色
        </Link>
        <a
          href="#about"
          className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
        >
          关于
        </a>
        {registered ? (
          <Button
            onClick={handleLogout}
            className="h-9 rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            退出登录
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/checking")}
            className="h-9 rounded-full bg-white px-5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-md"
          >
            注册
          </Button>
        )}
      </nav>
    </header>
  );
}
