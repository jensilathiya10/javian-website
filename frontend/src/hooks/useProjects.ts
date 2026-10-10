import { useEffect, useState } from "react";
import { fetchProjects } from "../lib/api";
import { FALLBACK_PROJECTS } from "../lib/projects";
import type { Project } from "../types";

/** Renders fallback content immediately, then upgrades to API data if available. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [source, setSource] = useState<"fallback" | "api">("fallback");
  useEffect(() => {
    let alive = true;
    fetchProjects()
      .then((p) => {
        if (alive && p.length) {
          setProjects(p);
          setSource("api");
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return { projects, source };
}
