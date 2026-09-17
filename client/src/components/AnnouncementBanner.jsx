import { useBanner } from '../BannerContext'

export function AnnouncementBanner() {
  const { isBannerVisible, dismissBanner } = useBanner()

  if (!isBannerVisible) return null

  return (
    <aside
      role="region"
      aria-label="Service announcement"
      className="fixed top-0 inset-x-0 w-full z-[100] h-[54px] md:h-[38px] bg-[#0c1017]/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-3 md:px-6 transition-colors"
      style={{
        boxShadow: '0 1px 12px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
        <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#60A5FA] font-inter text-[10px] md:text-[11px] font-medium tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          Notice
        </span>
        <p className="font-inter text-[11px] md:text-[12px] text-white/85 tracking-[-0.01em] leading-tight md:leading-normal line-clamp-2 md:line-clamp-1 m-0">
          Live demo server is sleeping — free-tier hosting suspended the service. The UI is fully browsable; claims won't sync.
        </p>
      </div>

      <button
        type="button"
        onClick={dismissBanner}
        aria-label="Dismiss announcement"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer border-0 bg-transparent text-lg leading-none p-0 focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </aside>
  )
}
