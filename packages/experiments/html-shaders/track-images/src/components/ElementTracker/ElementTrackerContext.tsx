import { createContext, useContext, useState } from "react";
import { ClientRect } from "../../utils/use-client-rect";

interface BaseTrackedElement {
  id: string;
  rect: ClientRect;
  group?: string;
  element: HTMLElement;
}

export interface TrackedElement extends BaseTrackedElement {
  type: "element";
}

export interface TrackedImage extends BaseTrackedElement {
  type: "image";
  source: string;
  autoAdd: boolean;
  element: HTMLImageElement;
  vertexShader?: string;
  fragmentShader?: string;
}

export type TrackedHtml = TrackedElement | TrackedImage;

export interface TrackedHtmlStore {
  [id: string]: TrackedHtml;
}

export interface ElementTrackerContextValue {
  register: (element: TrackedHtml) => void;
  remove: (id: string) => void;
  trackedElements: TrackedHtmlStore;
}

export const ElementTrackerContext = createContext<ElementTrackerContextValue>({
  register: () => {},
  remove: () => {},
  trackedElements: {},
});

export const ElementTrackerContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [trackedElements, setTrackedElements] = useState<TrackedHtmlStore>({});
  const register = (element: TrackedHtml) => {
    setTrackedElements((trackedElements) => ({
      ...trackedElements,
      [element.id]: element,
    }));
  };
  const remove = (id: string) => {
    setTrackedElements((trackedElements) => {
      const { [id]: _, ...rest } = trackedElements;
      return rest;
    });
  };

  return (
    <ElementTrackerContext.Provider
      value={{
        register,
        remove,
        trackedElements,
      }}
    >
      {children}
    </ElementTrackerContext.Provider>
  );
};

type TrackerFilter = (element: TrackedHtml) => boolean;

export function useElementTracker(filter?: TrackerFilter) {
  const { trackedElements: objectTrackedElements, ...other } = useContext(
    ElementTrackerContext
  );
  const trackedElementsArray = Object.values(objectTrackedElements);
  const trackedElements = filter
    ? trackedElementsArray.filter(filter)
    : trackedElementsArray;
  return {
    ...other,
    trackedElements,
  };
}

export function useTrackedGroup<T = TrackedHtml>(group: string): T[] {
  const { trackedElements } = useElementTracker((e) => e.group === group);
  return trackedElements as T[];
}
