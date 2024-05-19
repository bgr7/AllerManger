import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicRoutes = ["/sign-in", /^\/sign-up.*/];

export default authMiddleware({
  publicRoutes,
  afterAuth(auth, req, ev) {
    // Obtain the base URL from the request
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";

    // Check if the current path matches any of the public routes
    const isPublicRoute = publicRoutes.some(route => {
      if (typeof route === "string") {
        return req.nextUrl.pathname === route;
      } else {
        return route.test(req.nextUrl.pathname);
      }
    });

    // Redirect unauthenticated users to the sign-in page if not on a public route
    if (!auth.userId && !isPublicRoute) {
      return NextResponse.redirect(url);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
