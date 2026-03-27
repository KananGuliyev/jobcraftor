interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="eyebrow-label">{eyebrow}</p> : null}
      <div className="space-y-2">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{description}</p>
      </div>
    </div>
  );
}
