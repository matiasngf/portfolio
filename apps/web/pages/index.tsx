import Link from "next/link";
import React from "react";
import { ProjectCard } from "../components/project-card";
import { projectsConfig } from "../utils/projects-config";

export default function Web() {
  return (
    <>
      <div className="container pb-32 space-y-8 max-w-4xl relative pt-28 md:pt-52">
        <h2 className="font-display text-center text-background text-5xl lg:text-8xl tracking-wide text-shadow-line shadow-primary cursor-default">
          EXPERIMENTS
        </h2>
        <div className="space-y-4 text-center">
          <h3 className="text-2xl">👋 hi</h3>
          <p>
            I{"'"}m matias, a front end dev with a background in graphic design
            and passionate about AI.
          </p>
          <p>
            This site contains web experiments using OpenGl, Webpack, React,
            Compilers, etc.
          </p>
          <p>
            I{"'"}ll keep adding projects here, if you want to see more, check
            out my{" "}
            <Link href="https://github.com/matiasngf/" target="_blank">
              <span className="text-link">GitHub</span>
            </Link>
            .
          </p>
        </div>
        <div className="space-y-8 lg:space-y-4 pt-8">
          {Object.entries(projectsConfig).map(([key, config]) => {
            return (
              <div className="" key={key}>
                <ProjectCard projectKey={key} project={config} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
