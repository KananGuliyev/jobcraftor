import Image from "next/image";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/jobcraftor-logo.png"
              alt="JobCraftor logo"
              width={512}
              height={512}
              priority
              className="h-11 w-11 shrink-0 rounded-[14px] object-contain shadow-[0_12px_26px_rgba(8,12,22,0.28)] sm:h-12 sm:w-12"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold text-sand">JobCraftor</p>
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-mist/55 sm:block">
              Turn postings into application plans
            </p>
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
          <a href="#workflow" className="rounded-full px-4 py-2 transition hover:bg-white/[0.05] hover:text-sand">
            Start
          </a>
        </nav>
      </div>
    </header>
  );
}
