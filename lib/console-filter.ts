// Filter out Privy analytics errors in development
export function setupConsoleFilter() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    const originalWarn = console.warn;

    // List of error patterns to filter out
    const patternsToFilter = [
      "analytics_events",
      "auth.privy.io/api/v1/analytics",
      "POST https://auth.privy.io/api/v1/analytics_events",
      "Access to fetch at 'https://auth.privy.io/api/v1/analytics_events'",
    ];

    // Override console.error
    console.error = function (...args: any[]) {
      const message = args.join(" ");
      const shouldFilter = patternsToFilter.some((pattern) =>
        message.includes(pattern)
      );

      if (!shouldFilter) {
        originalError.apply(console, args);
      }
    };

    // Override console.warn
    console.warn = function (...args: any[]) {
      const message = args.join(" ");
      const shouldFilter = patternsToFilter.some((pattern) =>
        message.includes(pattern)
      );

      if (!shouldFilter) {
        originalWarn.apply(console, args);
      }
    };
  }
}
