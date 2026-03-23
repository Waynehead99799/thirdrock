import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };

type State = { hasError: boolean; message: string | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Something broke in this section.</p>
          {this.state.message ? (
            <p className="mt-1 text-red-700">{this.state.message}</p>
          ) : null}
          <button
            type="button"
            className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 text-red-900 hover:bg-red-100"
            onClick={() => this.setState({ hasError: false, message: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
