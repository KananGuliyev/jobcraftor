interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-sky/80">{eyebrow}</p> : null}
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold text-sand">{title}</h2>
        <p className="section-copy">{description}</p>
      </div>
    </div>
  );
}
