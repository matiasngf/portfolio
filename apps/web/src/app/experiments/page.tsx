import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getExperiments } from "@/lib/experiments";

export const metadata: Metadata = {
  title: "Experiments | Matias Gonzalez Fernandez",
  description: "Small graphics experiments built to learn and play.",
};

export default async function ExperimentsPage() {
  const experiments = await getExperiments();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/"
        className="font-sans text-sm text-foreground/50 hover:text-foreground transition-colors mb-8 inline-block"
      >
        ← Home
      </Link>

      <h1
        className="font-display leading-none tracking-wide text-[5rem] sm:text-[7.5rem]"
        style={{ fontVariationSettings: '"wght" 663' } as React.CSSProperties}
      >
        Experiments
      </h1>
      <p className="mt-2 mb-12 font-serif text-base italic text-foreground/60">
        Small things I build to learn and play with graphics.
      </p>

      {experiments.length === 0 ? (
        <p className="font-serif text-foreground/60">
          Experiments are unavailable right now. Please check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => (
            <a
              key={experiment.name}
              href={experiment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              {/* Preview */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/[0.06]">
                {experiment.preview ? (
                  <Image
                    src={experiment.preview}
                    alt={experiment.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-sans text-xs tracking-widest uppercase text-foreground/30">
                      {experiment.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta */}
              <h2 className="mt-4 font-serif text-2xl leading-tight">
                {experiment.title}
              </h2>
              <p className="mt-1 font-serif text-sm text-foreground/60 leading-snug">
                {experiment.description}
              </p>
              <span className="mt-3 inline-block font-sans text-xs tracking-widest uppercase text-foreground/40">
                {experiment.tagsLabel}
              </span>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
