import { NextRequest, NextResponse } from "next/server";

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/signup", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas e assets estáticos
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Verificar cookie de sessão do Better Auth
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
