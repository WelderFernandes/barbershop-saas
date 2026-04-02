import { NextRequest, NextResponse } from "next/server";

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/signup", "/api/auth", "/book"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const host = request.headers.get("host") || "";

  // Lógica de Subdomínio Multi-Tenant
  // Detecta se existe um subdomínio (ex: unidade.localhost:3000 ou unidade.barber.sh)
  const hostname = host.split(":")[0];
  const domainParts = hostname.split(".");
  const isLocalhost = hostname === "localhost" || hostname.endsWith(".localhost");
  
  let subdomain = "";
  if (isLocalhost) {
    if (domainParts.length > 1) subdomain = domainParts[0];
  } else {
    // Para domínios de produção como barber.sh, o subdominio seria a terceira parte de trás pra frente ou algo similar
    // Ex: unidade.barber.sh -> parts=["unidade", "barber", "sh"] -> length=3
    if (domainParts.length > 2) subdomain = domainParts.slice(0, -2).join(".");
  }

  // Se houver subdominio e não for uma rota técnica
  if (subdomain && !pathname.startsWith("/api") && !pathname.startsWith("/_next") && !pathname.startsWith("/static")) {
    // Reescrever internamente para /book/[slug]
    // A URL no navegador continuará sendo 'unidade.localhost:3000/' 
    // mas o Next.js renderizará a página de 'app/(public)/book/[slug]'
    return NextResponse.rewrite(new URL(`/book/${subdomain}${pathname}`, request.url));
  }

  // Permitir rotas públicas e assets estáticos
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Verificar sessão via API interna do Better Auth
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
