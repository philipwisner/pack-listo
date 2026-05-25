import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MOCK_COOKIE_NAME, isMockMode } from "./utils/auth/shared";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Exclude static assets, icons, public assets, and api/storybook routes from proxy interception
  const isStaticFile =
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".") || // e.g. favicon.ico, manifest.json, svg files
    url.pathname.startsWith("/storybook");

  if (isStaticFile) {
    return NextResponse.next();
  }

  let isAuthenticated = false;

  // 1. Check Mock Mode authentication session
  if (isMockMode()) {
    const mockCookie = request.cookies.get(MOCK_COOKIE_NAME);
    if (mockCookie && mockCookie.value) {
      try {
        JSON.parse(decodeURIComponent(mockCookie.value));
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }
  } else {
    // 2. Check Supabase authentication session
    let response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 3. Routing and Redirect logic
  
  // A. If accessing root '/' route, redirect to /dashboard or /login
  if (url.pathname === "/") {
    if (isAuthenticated) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // B. If accessing protected routes (like /dashboard) and not logged in, redirect to /login
  if (url.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // C. If accessing guest-only routes (like /login, /signup) and logged in, redirect to /dashboard
  if (url.pathname === "/login" || url.pathname === "/signup") {
    if (isAuthenticated) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Fallback to standard request pipeline
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercept all routes except static/public files
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
