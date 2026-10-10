import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
