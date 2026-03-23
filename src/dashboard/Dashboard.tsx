import { useMemo } from "react";
import { PostsChart } from "./PostsChart";
import { PostsTable } from "./PostsTable";
import { useDashboard } from "./useDashboard";

function normalizeSearch(s: string) {
  return s.trim().toLowerCase();
}

export default function Dashboard() {
  const { state, dispatch, reload } = useDashboard();

  const userOptions = useMemo(() => {
    const ids = new Set(state.posts.map((p) => p.userId));
    return Array.from(ids).sort((a, b) => a - b);
  }, [state.posts]);

  const filteredPosts = useMemo(() => {
    const q = normalizeSearch(state.search);
    const uid = state.userId === "" ? null : Number(state.userId);
    return state.posts.filter((p) => {
      if (uid !== null && !Number.isNaN(uid) && p.userId !== uid) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
      );
    });
  }, [state.posts, state.search, state.userId]);

  const chartData = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of filteredPosts) {
      counts.set(p.userId, (counts.get(p.userId) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([userId, value]) => ({
      label: `User ${userId}`,
      value,
    }));
  }, [filteredPosts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / state.pageSize),
  );
  const safePage = Math.min(state.page, totalPages);
  const pagePosts = useMemo(() => {
    const start = (safePage - 1) * state.pageSize;
    return filteredPosts.slice(start, start + state.pageSize);
  }, [filteredPosts, safePage, state.pageSize]);

  if (state.status === "loading" && state.posts.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-600">
        Loading posts…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Could not load data.</p>
        <p className="mt-1">{state.error}</p>
        <button
          type="button"
          className="mt-3 rounded border border-amber-300 bg-white px-3 py-1.5 hover:bg-amber-100"
          onClick={reload}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Posts dashboard</h1>
          <p className="text-sm text-neutral-600">
            Using GET posts api from JSONPlaceholder "https://jsonplaceholder.typicode.com/posts"
          </p>
        </div>
        <button
          type="button"
          className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
          onClick={reload}
          disabled={state.status === "loading"}
        >
          {state.status === "loading" ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-neutral-700">
          Search title or body
          <input
            type="search"
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "set_search", value: e.target.value })
            }
            className="rounded border border-neutral-300 px-2 py-1.5 text-sm font-normal"
            placeholder="e.g. sunt"
          />
        </label>
        <label className="flex w-40 flex-col gap-1 text-xs font-medium text-neutral-700">
          User
          <select
            value={state.userId}
            onChange={(e) =>
              dispatch({ type: "set_user_id", value: e.target.value })
            }
            className="rounded border border-neutral-300 px-2 py-1.5 text-sm font-normal"
          >
            <option value="">All</option>
            {userOptions.map((id) => (
              <option key={id} value={String(id)}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-32 flex-col gap-1 text-xs font-medium text-neutral-700">
          Page size
          <select
            value={state.pageSize}
            onChange={(e) =>
              dispatch({
                type: "set_page_size",
                pageSize: Number(e.target.value),
              })
            }
            className="rounded border border-neutral-300 px-2 py-1.5 text-sm font-normal"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-3">
          <PostsTable
            posts={pagePosts}
            emptyMessage={
              state.posts.length === 0
                ? "No posts loaded."
                : "No posts match these filters."
            }
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-700">
            <span>
              Page {safePage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded border border-neutral-300 bg-white px-2 py-1 disabled:opacity-40"
                disabled={safePage <= 1}
                onClick={() => dispatch({ type: "set_page", page: safePage - 1 })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border border-neutral-300 bg-white px-2 py-1 disabled:opacity-40"
                disabled={safePage >= totalPages}
                onClick={() => dispatch({ type: "set_page", page: safePage + 1 })}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <PostsChart
          data={chartData}
          title="Posts per user (filtered)"
        />
      </div>
    </div>
  );
}
