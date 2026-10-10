import { HeroNetwork } from "./HeroNetwork";

/** Hero backdrop: the Javian network "J", filling the hero behind the headline. Decorative. */
export function HeroVisual({ progress }: { progress?: { get(): number } }) {
  return (
    <div className="hero-field pointer-events-none absolute inset-0 select-none opacity-50 md:opacity-100" aria-hidden>
      <HeroNetwork progress={progress} />
    </div>
  );
}
