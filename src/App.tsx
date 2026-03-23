import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MultiselectDemoPage } from "./pages/MultiselectDemoPage";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));

function NavBar() {
  return (
    <nav className="mx-auto mb-6 flex max-w-6xl gap-2 border-b border-neutral-200 pb-2">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `rounded px-3 py-1.5 text-sm no-underline ${
            isActive
              ? "bg-neutral-800 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/multiselect"
        className={({ isActive }) =>
          `rounded px-3 py-1.5 text-sm no-underline ${
            isActive
              ? "bg-neutral-800 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`
        }
      >
        Multiselect demo
      </NavLink>
    </nav>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen p-6">
        <NavBar />
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<Navigate to="/multiselect" replace />} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                        Loading dashboard…
                      </div>
                    }
                  >
                    <Dashboard />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route path="/multiselect" element={<MultiselectDemoPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
