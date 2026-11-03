import BrandLogo from "./BrandLogo";

export default function Navbar({ session, onSignOut }) {
  const userEmail = session?.user?.email || "Creator";
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/60 shadow-[0_4px_24px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <BrandLogo size="md" showSubtitle={true} />
          </div>

          {/* Right: Engine Status & User Actions */}
          <div className="flex items-center gap-3">
            {/* Live Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine Active</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 border border-purple-200/60">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {userInitials}
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[120px] sm:max-w-[180px]">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 rounded-xl transition duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
