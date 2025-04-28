import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const session = request.cookies.get("next-auth.session-token")?.value;

  const authenticationRoutes = ["/login", "/register"];
  const protectedRoutes = ["/home", "/profile"];
  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  // const isAuthenticationRoutes = authenticationRoutes.some((path) =>
  //   request.nextUrl.pathname.startsWith(path)
  // );
  if (isProtected && !token && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // if (isAuthenticationRoutes && (token || session)) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }
  return NextResponse.next();
}
