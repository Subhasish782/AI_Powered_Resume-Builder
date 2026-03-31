import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (
          req.nextUrl.pathname.startsWith("/home") ||
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/profile") ||
          req.nextUrl.pathname.startsWith("/upload") ||
          req.nextUrl.pathname.startsWith("/analyze") ||
          req.nextUrl.pathname.startsWith("/builder") ||
          req.nextUrl.pathname.startsWith("/match") ||
          req.nextUrl.pathname.startsWith("/history")
        ) {
          return token !== null;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
