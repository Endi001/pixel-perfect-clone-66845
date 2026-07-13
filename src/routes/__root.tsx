import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/stride/SiteNav";
import { Footer } from "@/components/stride/Footer";
import { BookingModal } from "@/components/stride/BookingModal";
import { BookingProvider } from "@/components/stride/booking-context";
import { useLenis } from "@/hooks/use-lenis";

function NotFoundComponent() {
  return (
    <div className="stride-section-dark min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow text-[color:var(--muted-on-dark)]">404</div>
        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9]">
          Off route.
        </h1>
        <p className="mt-4 text-sm text-[color:var(--muted-on-dark)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center bg-[color:var(--ember)] px-5 py-3 text-sm font-medium text-[color:var(--ember-foreground)]"
            style={{ borderRadius: 3 }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="stride-section-light min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow text-[color:var(--muted-on-light)]">Something broke</div>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[0.9]">
          This page didn't load.
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-[color:var(--ember)] px-5 py-3 text-sm font-medium text-[color:var(--ember-foreground)]"
            style={{ borderRadius: 3 }}
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-3 border border-[color:var(--hairline-light)] text-sm"
            style={{ borderRadius: 3 }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "STRIDE Physiotherapy — Momentum is built, not born." },
      {
        name: "description",
        content:
          "STRIDE is a physiotherapy clinic in Ashfield Quay treating pain, injury and mobility problems. We rebuild movement — assess, treat, rebuild, return.",
      },
      { name: "author", content: "STRIDE Physiotherapy" },
      { property: "og:title", content: "STRIDE Physiotherapy — Momentum is built, not born." },
      {
        property: "og:description",
        content:
          "Physiotherapy in Ashfield Quay. We treat pain, rebuild movement, and get you back to full speed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@300;500;700;900&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "preload",
        as: "style",
        href: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@300;500;700;900&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <AppShell />
      </BookingProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  useLenis();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-[color:var(--ember)] focus:text-[color:var(--ember-foreground)] focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <BookingModal />
    </>
  );
}
