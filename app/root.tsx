import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { ClerkApp, ClerkErrorBoundary } from "@clerk/remix";
import { trpc } from "~/utils/trpc";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: "/trpc" })] })
  );

  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container py-3">
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </trpc.Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);

export const ErrorBoundary = ClerkErrorBoundary();
