import { NextRequest, NextResponse } from "next/server";

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/signup", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas e assets estáticos
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Verificar sessão via API interna do Better Auth
  // O Proxy/Middleware roda no Edge, então usamos fetch padrão.
  try {
    const response = await fetch(new URL("/api/auth/get-session", request.url), {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const session = await response.json().catch(() => null);

    if (!session || !session.session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Lógica Multi-Tenant: Garantir organização ativa no Dashboard
    const isDashboard = pathname.startsWith("/dashboard");
    const isOnboarding = pathname.startsWith("/dashboard/onboarding");

    if (isDashboard && !isOnboarding) {
      if (!session.session.activeOrganizationId) {
        return NextResponse.redirect(new URL("/dashboard/onboarding", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.next();
  }
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
