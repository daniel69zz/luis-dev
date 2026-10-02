interface SectionHeadingProps {
  index: string;
  title: string;
  id?: string;
}

export function SectionHeading({ index, title, id }: SectionHeadingProps) {
  return (
    <h2 id={id} className="mb-10 flex items-center gap-4 font-mono text-xl font-semibold text-fg sm:text-2xl">
      <span className="text-accent">
        {index}.<span className="text-subtle">/</span>
      </span>
      {title}
      <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-line-strong to-transparent" />
    </h2>
  );
}
