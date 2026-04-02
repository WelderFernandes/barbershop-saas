"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await completeOnboarding({ name, slug: slug.toLowerCase() });
      router.push("/dashboard/agenda");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar barbearia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center p-4">
      <Card className="w-full max-w-xl rounded-md border border-primary/10 bg-background shadow-xl">
        <CardHeader className="border-b border-primary/5 bg-primary/5 p-8">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-background mb-4">
            <HugeiconsIcon icon={Home01Icon} className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-3xl font-black uppercase tracking-tighter">
            Configure sua <br /> Unidade
          </CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
            01 // Inicialização do Sistema Multi-Tenant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border-l-4 border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Nome da Barbearia
                </Label>
                <Input
                  id="org-name"
                  placeholder="Ex: Barber Brutal Classic"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  required
                  className="h-12 border border-primary/20 bg-background px-4 rounded-2xl focus-visible:ring-0 focus-visible:border-primary transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-slug" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Identificador de URL (Slug)
                </Label>
                <div className="relative">
                  <Input
                    id="org-slug"
                    placeholder="barber-brutal"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    required
                    className="h-12 border border-primary/20 bg-background px-4 pl-12 rounded-2xl focus-visible:ring-0 focus-visible:border-primary transition-all font-mono text-xs"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-mono text-xs italic">
                    @/
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-primary/20 p-6 space-y-4 bg-muted/20">
               <div className="flex items-start gap-4">
                 <div className="mt-1 h-2 w-2 bg-primary rounded-full" />
                 <p className="text-[10px] font-mono leading-relaxed opacity-70">
                    O sistema criará automaticamente uma organização no Better Auth para esta unidade.
                 </p>
               </div>
               <div className="flex items-start gap-4">
                 <div className="mt-1 h-2 w-2 bg-primary rounded-full" />
                 <p className="text-[10px] font-mono leading-relaxed opacity-70">
                    Todos os barbeiros, serviços e agendamentos serão isolados para este identificador.
                 </p>
               </div>
            </div>

            <Button
              type="submit"
              className="h-16 w-full font-heading text-xl font-black uppercase tracking-widest rounded-3xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-100"
              disabled={loading}
            >
              {loading ? "Processando Terminal..." : "Finalizar Configuração"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
