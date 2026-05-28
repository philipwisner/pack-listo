import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GUEST_ONLY_ROUTES = ["/login", "/signup"];
const AUTH_HOME = "/dashboard";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1. Performance Gate: Drop Next.js background pre-fetches early if no session cookie exists
  // This saves heavy Supabase CPU/API calls before a user even fills out your form.
  const isPrefetch = request.headers.get("purpose") === "prefetch";
  const hasSessionCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  if (
    isPrefetch &&
    !hasSessionCookie &&
    !GUEST_ONLY_ROUTES.includes(pathname)
  ) {
    return new NextResponse(null, {
      status: 401,
      headers: { "x-middleware-skip": "true" },
    });
  }

  // 2. Single Response Context Initialization
  let response = NextResponse.next({ request });

  // 3. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // CRITICAL FIX FOR SERVER ACTIONS:
          // Mutate the request and response objects inline. Do NOT re-create the NextResponse instance.
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 4. Evaluate Authentication Status
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }
  const isAuthenticated = !!user;

  // 5. Centralized Routing Pipeline

  // A. Root Domain Pivot
  if (pathname === "/") {
    url.pathname = isAuthenticated ? AUTH_HOME : "/login";
    return NextResponse.redirect(url);
  }

  // B. Guest-Only Route Verification
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

  // C. Default-Closed Gatekeeper
  if (!isAuthenticated) {
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Return the stable, cookie-carrying response object context
  return response;
}

export const config = {
  matcher: [
    // Ensure all assets, microservices, and internal tools are bypassed
    "/((?!_next/static|_next/image|favicon.ico|static|storybook|api|.*\\..*).*)",
  ],
};
