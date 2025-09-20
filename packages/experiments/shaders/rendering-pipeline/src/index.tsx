import { createRoot } from "react-dom/client";
import { App } from "./app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element with ID 'root'");
}

const root = createRoot(rootElement);
root.render(<App />);
