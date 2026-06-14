import { getExperiments } from "@/lib/experiments";
import { ExperimentsList } from "./experiments-list";

export async function Experiments() {
  const experiments = await getExperiments();

  // Nothing to show (e.g. manifest fetch failed) — render nothing.
  if (experiments.length === 0) return null;

  // The manifest has no recency field; "latest" = the last 5 entries.
  const latest = experiments.slice(-5);

  return (
    <section id="experiments" className="pb-32 pt-24">
      {/* Section header */}
      <div className="px-6">
        <h2
          className="font-display leading-none tracking-wide text-[7.5rem]"
          style={{ fontVariationSettings: '"wght" 663' } as React.CSSProperties}
        >
          Experiments
        </h2>
        <p className="mt-2 mb-12 font-serif text-base italic text-foreground/60">
          Small things I build to learn and play with graphics.
        </p>
      </div>

      <ExperimentsList items={latest} />
    </section>
  );
}
