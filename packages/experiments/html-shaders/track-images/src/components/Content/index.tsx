import { useState } from "react";
import { ThreeImage } from "../ThreeImage";

export const Content = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className={isExpanded ? "min-h-[200px]" : "min-h-[348px]"}>
        <button onClick={handleExpand}>Expand</button>
        <p>{"Hello world ".repeat(60)}</p>
      </div>
      <ThreeImage src="http://placekitten.com/200/300" />
      <div className="h-screen">Second</div>
    </div>
  );
};
