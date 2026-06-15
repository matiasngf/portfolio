// Server-side consumption of the experiments deployment manifest.
// The experiments app (apps/experiments-server) scans packages/experiments/*,
// builds each one, and emits a static `experiments-manifest.json` + one folder
// per experiment. We fetch that manifest here to render the homepage section
// and the /experiments grid.

const FALLBACK_BASE = "https://experiments-matias-gfs-projects.vercel.app";

/** Base URL of the experiments deployment (no trailing slash). */
export const EXPERIMENTS_BASE = (
  process.env.NEXT_PUBLIC_EXPERIMENTS_URL || FALLBACK_BASE
).replace(/\/$/, "");

/** Raw entry shape as emitted by experiments-server `generateExperimentsManifest`. */
interface ManifestEntry {
  /** Unique identifier/slug, used for the folder name and URL (e.g. "earth"). */
  name: string;
  /** Human-readable display name. Optional for backwards-compat with older manifests. */
  title?: string;
  description: string;
  tags: string[];
  list: boolean;
  /** Path relative to the experiments deployment root, e.g. "/earth/screenshot.png". */
  preview?: string;
}

interface Manifest {
  generatedAt: string;
  experiments: ManifestEntry[];
}

/** Normalized experiment used across the web app. */
export interface Experiment {
  /** Unique identifier/slug, e.g. "earth". */
  name: string;
  /** Human-readable display name, e.g. "Earth with a realistic atmosphere". */
  title: string;
  description: string;
  tags: string[];
  /** Joined tags for display, e.g. "three.js · webgl". */
  tagsLabel: string;
  /** Absolute URL to the live experiment, e.g. ".../earth/". */
  url: string;
  /** Absolute URL to the preview screenshot, or null when none exists. */
  preview: string | null;
}

function normalize(entry: ManifestEntry): Experiment {
  return {
    name: entry.name,
    // Fall back to the slug if an older manifest has no title yet.
    title: entry.title || entry.name,
    description: entry.description,
    tags: entry.tags ?? [],
    tagsLabel: (entry.tags ?? []).join(" · "),
    url: `${EXPERIMENTS_BASE}/${entry.name}/`,
    preview: entry.preview ? `${EXPERIMENTS_BASE}${entry.preview}` : null,
  };
}

/**
 * Fetch the experiments manifest (ISR, revalidated hourly). Returns the
 * listable experiments in manifest order. On any failure returns an empty
 * array so pages still render.
 */
export async function getExperiments(): Promise<Experiment[]> {
  try {
    const res = await fetch(`${EXPERIMENTS_BASE}/experiments-manifest.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const manifest = (await res.json()) as Manifest;
    return manifest.experiments
      .filter((e) => e.list)
      .map(normalize);
  } catch {
    return [];
  }
}
