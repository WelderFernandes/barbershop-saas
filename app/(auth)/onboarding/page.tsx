"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBarbershop } from "@/lib/actions/barbershop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [barbershopName, setBarbershopName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createBarbershop({
        name: barbershopName,
        phone: phone || undefined,
      });

      if (result.success) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar barbearia. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-xl">🏪</span>
        </div>
        <CardTitle className="text-2xl font-bold">
          Configure sua barbearia
        </CardTitle>
        <CardDescription>
          Informe os dados básicos para começar
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="barbershopName">Nome da barbearia</Label>
            <Input
              id="barbershopName"
              type="text"
              placeholder="Ex: Barbearia do João"
              value={barbershopName}
              onChange={(e) => setBarbershopName(e.target.value)}
              required
              minLength={2}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefone{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="h-11 w-full text-base font-semibold"
            disabled={loading}
          >
            {loading ? "Criando..." : "Começar a usar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
