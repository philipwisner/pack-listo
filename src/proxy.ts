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

  // 2. Setup standard response
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // 3. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync changes to BOTH request and response to survive the Next.js runtime boundary
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 4. Evaluate Session
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }
  const isAuthenticated = !!user;

  // 5. Routing Logic
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

  // 6. CRITICAL FOR RESTRUCK VERCEL CONTAINERS:
  // Explicitly map response-mutated Set-Cookie headers back onto Next.js request headers.
  // This bypasses the async cookies() context loss in Page components.
  const finalHeaders = new Headers(request.headers);

  // Package cookies nicely as a standard Cookie string format
  const currentCookiesString = request.cookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (currentCookiesString) {
    finalHeaders.set("cookie", currentCookiesString);
  }

  // Construct a brand new response frame carrying the verified header chain
  const verifiedResponse = NextResponse.next({
    request: {
      headers: finalHeaders,
    },
  });

  // Re-append the cookie definitions so the client browser saves them
  response.cookies.getAll().forEach((cookie) => {
    verifiedResponse.cookies.set(cookie.name, cookie.value);
  });

  return verifiedResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|static|storybook|api|.*\\..*).*)",
  ],
};
