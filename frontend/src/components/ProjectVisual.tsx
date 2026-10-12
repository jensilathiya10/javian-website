const IMAGES: Record<string, string> = {
  "cafe-linde": "/images/projects/cafe-linde.jpg",
  "studio-x": "/images/projects/studio-x.jpg",
  "brew-bloom": "/images/projects/brew-bloom.jpg",
  "three-tyres-grocery": "/images/projects/three-tyres-grocery.jpg",
};

export function ProjectVisual({ slug, title }: { slug: string; title: string }) {
  const src = IMAGES[slug];
  return (
    <div
      className="overflow-hidden rounded-2xl border border-line-strong shadow-[0_40px_90px_-40px_rgb(128_87_255/0.7)]"
      role="img"
      aria-label={`${title} — project screenshot`}
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-[#0b0e26] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-lav/30" />
        <span className="h-2 w-2 rounded-full bg-lav/30" />
        <span className="h-2 w-2 rounded-full bg-cyan" />
        <span className="ml-3 font-mono text-[0.6rem] tracking-wider text-muted">{title.toLowerCase().replace(/\s+/g, "-")}</span>
      </div>
      {src ? (
        <img
          src={src}
          alt={`${title} website screenshot`}
          className="aspect-[16/10] w-full object-cover object-top"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[16/10] bg-indigo" />
      )}
    </div>
  );
}
