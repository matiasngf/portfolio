import { Hero } from "./sections/hero";
// import { Works } from "./sections/works";
import { Articles } from "./sections/articles";
import { Experiments } from "./sections/experiments";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative bg-background">
        <Articles />
        <Experiments />
        {/* Works section hidden until its content is ready */}
        {/* <Works /> */}
      </div>
    </main>
  );
}
