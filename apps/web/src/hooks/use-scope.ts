import { createScope, Scope } from "animejs";
import { useEffect, useRef } from "react";

export function useScope<T = unknown>(callback: (scope: Scope) => void) {
  const root = useRef<T>(null);
  const scope = useRef<Scope>(null);

  useEffect(() => {
    scope.current = createScope({ root: root as any }).add((s) => s && callback(s));

    return () => scope.current?.revert();
  }, []);

  return [root, scope] as const
}