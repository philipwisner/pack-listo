import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GUEST_ONLY_ROUTES = ["/login", "/signup"];
const AUTH_HOME = "/dashboard";
const UNAUTH_HOME = "/login";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1. Performance Gate
  const isPrefetch = request.headers.get("purpose") === "prefetch";
  const hasSessionCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  if (!hasSessionCookie && !GUEST_ONLY_ROUTES.includes(pathname)) {
    if (pathname === "/") {
      url.pathname = UNAUTH_HOME;
      return NextResponse.redirect(url);
    }
    if (isPrefetch) {
      return NextResponse.next({ request });
    }
    url.pathname = UNAUTH_HOME;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Setup standard response container (Keep this as our single source of truth)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Initialize Supabase Client directly bound to our original request/response loop
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // Re-bind the modified headers back to the runtime execution frame
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 4. Evaluate Session securely
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }
  const isAuthenticated = !!user;

  // 5. Routing Logic Gates
  if (pathname === "/") {
    url.pathname = isAuthenticated ? AUTH_HOME : UNAUTH_HOME;
    return NextResponse.redirect(url);
  }

  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some(
    (route) => pathname === route,
  );

  if (isGuestOnlyRoute) {
    if (isAuthenticated) {
      url.pathname = AUTH_HOME;
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (!isAuthenticated) {
    url.pathname = UNAUTH_HOME;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 6. PRODUCTION-READY HANDOFF FOR NEXT.JS 16
  // Return the original response container directly instead of creating a new frame.
  // This maintains your database client initialization state across execution contexts.
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|static|storybook|api|.*\\..*).*)",
  ],
};
