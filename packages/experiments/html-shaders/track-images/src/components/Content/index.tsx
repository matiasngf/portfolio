import { useState } from "react";
import { TurtleImage } from "./turtle-image";

export const Content = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="py-20 space-y-10">
      <div className="space-y-5">
        <button
          className="p-4 bg-black text-white rounded-md"
          onClick={handleExpand}
        >
          {isExpanded ? "Collapse section" : "Expand section"}
        </button>
        <p>
          The image below will be tracked on threejs, a rectangle will match its
          exact position and we will be able to apply a custom shader to it.
        </p>
        {isExpanded && <p>It will react to any position or size change.</p>}
      </div>
      <div>
        <TurtleImage />
      </div>
      <div className="h-screen">
        Try scrolling and see the image follow the DOM.
      </div>
    </div>
  );
};
