import { projects as seed, type Project } from "@/lib/content";
import { getSupabase, assetUrl, supabaseConfigured } from "@/lib/supabase";

/**
 * Work data layer.
 * Source of truth: Supabase `projects` table (thumbnails in the
 * project-assets bucket). When Supabase isn't configured the seed data
 * in content.ts serves the same shape with local thumbnails, so the
 * site is fully browsable before the backend exists.
 */

export type { Project };

type ProjectRow = {
  slug: string;
  name: string;
  category: string;
  year: string;
  blurb: string;
  detail: string;
  type: "web" | "software";
  metrics: { k: string; label: string }[] | null;
  stack: string[] | null;
  thumbnail_url: string | null;
  repo_url: string | null;
  viewer_url: string | null;
};

function rowToProject(r: ProjectRow): Project {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    year: r.year,
    blurb: r.blurb,
    detail: r.detail,
    type: r.type,
    metrics: Array.isArray(r.metrics) ? r.metrics : [],
    stack: r.stack ?? [],
    thumbnail: assetUrl(r.thumbnail_url) ?? "/logo.png",
    repoUrl: r.repo_url ?? "#",
    viewerUrl: r.viewer_url ?? undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  const sb = getSupabase();
  if (!sb) return seed;
  try {
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .order("sort", { ascending: true });
    if (error || !data?.length) return seed;
    return data.map(rowToProject);
  } catch {
    return seed;
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  const sb = getSupabase();
  if (!sb) return seed.find((p) => p.slug === slug) ?? null;
  try {
    const { data, error } = await sb.from("projects").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return seed.find((p) => p.slug === slug) ?? null;
    return rowToProject(data as ProjectRow);
  } catch {
    return seed.find((p) => p.slug === slug) ?? null;
  }
}
