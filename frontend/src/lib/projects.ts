import type { Project } from "../types";

export const FALLBACK_PROJECTS: Project[] = [
  {
    slug: "cafe-linde",
    title: "Café Linde",
    kind: "client",
    summary: "An elegant dark-themed website for a specialty coffee house with online table reservations.",
    problem: "Café Linde needed a premium online presence that matched the ambiance of their physical space and made it easy for guests to reserve a table.",
    approach: "Scroll-driven animations, immersive visuals and a seamless reservation flow — designed to reflect the craft behind every cup.",
    tags: ["Web Design", "React", "Animations", "Restaurant"],
  },
  {
    slug: "studio-x",
    title: "Studio X",
    kind: "client",
    summary: "A bold portfolio website for a photography and cinematic film studio based in Surat, India.",
    problem: "The studio's visual work deserved a website as striking as the moments they capture — existing templates couldn't do it justice.",
    approach: "High-impact typography, full-bleed imagery and a clean navigation that lets the work speak entirely for itself.",
    tags: ["Web Design", "Portfolio", "Photography", "Cinematic"],
  },
  {
    slug: "brew-bloom",
    title: "Brew & Bloom",
    kind: "client",
    summary: "A warm, editorial website for a coffee and plant shop with integrated online ordering.",
    problem: "Brew & Bloom needed a site that conveyed their unique blend of café culture and botanical lifestyle — not just a generic shop page.",
    approach: "Earthy colour palette, playful display typography and a product-first layout with a smooth ordering flow built in.",
    tags: ["Web Design", "E-commerce", "React", "Ordering"],
  },
  {
    slug: "three-tyres-grocery",
    title: "Three Tyres Grocery",
    kind: "client",
    summary: "A grocery delivery platform serving the Indian and South Asian community in Berlin.",
    problem: "The Indian diaspora in Berlin lacked a convenient way to order familiar grocery staples online with next-day delivery.",
    approach: "A clean, conversion-focused storefront with WhatsApp ordering, searchable product catalogue and a delivery slot system.",
    tags: ["Web Design", "E-commerce", "Grocery", "Delivery"],
  },
];
