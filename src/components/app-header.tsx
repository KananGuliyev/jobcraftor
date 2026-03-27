export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sunrise/20 bg-sunrise text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(246,165,79,0.18)]">
            JC
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-sand">JobCraftor</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-mist/55">Application execution engine</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1 text-sm text-mist/68 md:flex">
          <a href="#top" className="rounded-full px-4 py-2 transition hover:bg-white/[0.05] hover:text-sand">
            Home
          </a>
          <a href="#how-it-works" className="rounded-full px-4 py-2 transition hover:bg-white/[0.05] hover:text-sand">
            How it works
          </a>
          <a href="#results-preview" className="rounded-full px-4 py-2 transition hover:bg-white/[0.05] hover:text-sand">
            Preview
          </a>
          <a href="#dashboard" className="rounded-full px-4 py-2 transition hover:bg-white/[0.05] hover:text-sand">
            Workspace
          </a>
        </nav>
      </div>
    </header>
  );
}
