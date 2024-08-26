import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import {
  apiAuthPrefix,
  apiIntegrationsPrefix,
  apiJobsPrefix,
  authRoutes,
  externalApiPrefix,
  publicRoutes,
} from "@/routes";
import { DEFAULT_LOGIN_REDIRECT } from "./utils/constants";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiJobsRoute = nextUrl.pathname.startsWith(apiJobsPrefix);
  const isApiIntegrationsRoute = nextUrl.pathname.startsWith(
    apiIntegrationsPrefix,
  );
  const isFormsRoute = nextUrl.pathname.includes("/forms");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || isFormsRoute;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isExternalApiRoute = nextUrl.pathname.startsWith(externalApiPrefix);

  if (
    isApiAuthRoute ||
    isApiJobsRoute ||
    isApiIntegrationsRoute ||
    isExternalApiRoute
  ) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
