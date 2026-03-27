export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sunrise to-ember text-sm font-semibold text-slate-900">
            JC
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-sand">JobCraftor</p>
            <p className="text-xs uppercase tracking-[0.22em] text-mist/55">Application execution engine</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-mist/70 md:flex">
          <a href="#top" className="transition hover:text-sand">
            Home
          </a>
          <a href="#how-it-works" className="transition hover:text-sand">
            How it works
          </a>
          <a href="#results-preview" className="transition hover:text-sand">
            Preview
          </a>
          <a href="#dashboard" className="transition hover:text-sand">
            Workspace
          </a>
        </nav>
      </div>
    </header>
  );
}
