import { useCallback, useEffect, useReducer, useRef } from "react";
import { fetchPosts } from "../api/posts";
import {
  dashboardReducer,
  initialDashboardState,
} from "./dashboardReducer";

export function useDashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    dispatch({ type: "load_start" });
    fetchPosts(ctrl.signal)
      .then((posts) => {
        dispatch({ type: "load_success", posts });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        dispatch({ type: "load_error", message });
      });
  }, []);

  useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  return { state, dispatch, reload: load };
}
