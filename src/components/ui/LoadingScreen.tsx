interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  title = 'Loading',
  subtitle = 'Fetching the latest data.',
  fullScreen = false,
}: LoadingScreenProps) {
  const wrapperClass = fullScreen
    ? 'min-h-screen'
    : 'min-h-[55vh]';

  return (
    <div className={`${wrapperClass} flex items-center justify-center`}>
      <div className="glass-card relative overflow-hidden px-8 py-10 text-center max-w-md w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_45%)]" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-400">Superadmin</p>
          <h2 className="mt-2 text-xl font-semibold text-indigo-950">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
