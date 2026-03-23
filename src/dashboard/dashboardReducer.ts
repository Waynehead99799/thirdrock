import type { Post } from "../api/posts";

export type DashboardState = {
  posts: Post[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  search: string;
  userId: string;
  page: number;
  pageSize: number;
};

export const initialDashboardState: DashboardState = {
  posts: [],
  status: "idle",
  error: null,
  search: "",
  userId: "",
  page: 1,
  pageSize: 10,
};

export type DashboardAction =
  | { type: "load_start" }
  | { type: "load_success"; posts: Post[] }
  | { type: "load_error"; message: string }
  | { type: "set_search"; value: string }
  | { type: "set_user_id"; value: string }
  | { type: "set_page"; page: number }
  | { type: "set_page_size"; pageSize: number };

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "load_start":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "load_success":
      return {
        ...state,
        status: "success",
        posts: action.posts,
        error: null,
        page: 1,
      };
    case "load_error":
      return {
        ...state,
        status: "error",
        error: action.message,
      };
    case "set_search":
      return { ...state, search: action.value, page: 1 };
    case "set_user_id":
      return { ...state, userId: action.value, page: 1 };
    case "set_page":
      return { ...state, page: action.page };
    case "set_page_size":
      return { ...state, pageSize: action.pageSize, page: 1 };
    default:
      return state;
  }
}
