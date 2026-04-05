"use client"

import { useState, useTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateBarbershop } from "@/lib/actions/barbershop"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkBadge01Icon,
  FloppyDiskIcon,
  Store01Icon,
  ContactIcon,
  Location01Icon,
  Link01Icon,
  Camera01Icon,
  ImageAdd02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface GeneralFormProps {
  initialData: {
    id: string
    name: string
    slug: string
    phone: string | null
    address: string | null
    logoUrl: string | null
    coverUrl: string | null
    description: string | null
  }
}

export function GeneralForm({ initialData }: GeneralFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description || "")
  const [phone, setPhone] = useState(initialData.phone || "")
  const [address, setAddress] = useState(initialData.address || "")
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "")
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || "")

  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === "logo") setLogoUrl(reader.result as string)
      else setCoverUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateBarbershop({
          id: initialData.id,
          name,
          description,
          phone,
          address,
          logoUrl,
          coverUrl,
        })
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } catch (error) {
        alert(
          "Erro ao salvar: " +
            (error instanceof Error ? error.message : "Desconhecido")
        )
      }
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* Branding Section (Glassmorphic) */}
      <div className="group perspective-1000 relative">
        <div className="relative h-64 w-full overflow-hidden rounded-[40px] border border-white/20 bg-muted/20 shadow-2xl dark:border-white/10">
          {/* Cover Image */}
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt="Capa"
              width={1920}
              height={1080}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent/20 via-background to-accent/5">
              <HugeiconsIcon
                icon={ImageAdd02Icon}
                className="h-12 w-12 text-accent/30"
              />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => coverInputRef.current?.click()}
              className="rounded-full border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-white/40"
            >
              <HugeiconsIcon icon={Camera01Icon} className="mr-2 h-4 w-4" />
              Alterar Capa
            </Button>
          </div>
          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "cover")}
          />
        </div>

        {/* Logo (Avatar) */}
        <div className="group/logo absolute -bottom-12 left-10">
          <div className="relative h-32 w-32 overflow-hidden rounded-[32px] border-4 border-background bg-muted shadow-2xl ring-1 ring-white/20">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-accent/10">
                <HugeiconsIcon
                  icon={Store01Icon}
                  className="h-10 w-10 text-accent"
                />
              </div>
            )}
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover/logo:opacity-100"
              onClick={() => logoInputRef.current?.click()}
            >
              <HugeiconsIcon
                icon={Camera01Icon}
                className="h-6 w-6 text-white"
              />
            </div>
            <input
              type="file"
              ref={logoInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logo")}
            />
          </div>
        </div>

        <div className="absolute top-6 right-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black tracking-[0.2em] text-white/80 uppercase">
            Identidade Visual
          </p>
        </div>
      </div>

      {/* Grid de Informações Glassmorphic */}
      <div className="grid gap-8 pt-10 md:grid-cols-2">
        <div className="space-y-8 rounded-[40px] border border-white/20 bg-white/40 p-8 shadow-2xl shadow-accent/5 backdrop-blur-3xl dark:border-slate-800/20 dark:bg-slate-900/40">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase"
              >
                Nome da Barbearia
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-[20px] border-white/30 bg-white/50 text-lg font-bold shadow-inner transition-all hover:bg-white/80 focus:ring-accent dark:border-slate-800/50 dark:bg-slate-950/30 dark:hover:bg-slate-950/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase"
              >
                Descrição / História
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-[20px] border border-white/30 bg-white/50 p-4 text-sm font-medium shadow-inner transition-all select-none hover:bg-white/80 focus:ring-2 focus:ring-accent focus:outline-none dark:border-slate-800/50 dark:bg-slate-950/30 dark:hover:bg-slate-950/50"
                placeholder="Conte um pouco sobre sua barbearia, estilo e diferenciais..."
              />
            </div>

            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                Slug (Identificador)
              </Label>
              <div className="group/slug relative">
                <Input
                  value={initialData.slug}
                  disabled
                  className="h-14 cursor-not-allowed rounded-[20px] border-dashed border-border/50 bg-muted/10 pl-12 font-mono text-xs opacity-60"
                />
                <HugeiconsIcon
                  icon={Link01Icon}
                  className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 opacity-30 transition-opacity group-hover/slug:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 rounded-[40px] border border-white/20 bg-white/40 p-8 shadow-2xl shadow-accent/5 backdrop-blur-3xl dark:border-slate-800/20 dark:bg-slate-900/40">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase"
              >
                Contato WhatsApp
              </Label>
              <div className="group/phone relative">
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 rounded-[20px] border-white/30 bg-white/50 pl-12 font-bold shadow-inner transition-all hover:bg-white/80 focus:ring-accent dark:border-slate-800/50 dark:bg-slate-950/30 dark:hover:bg-slate-950/50"
                  placeholder="(00) 00000-0000"
                />
                <HugeiconsIcon
                  icon={ContactIcon}
                  className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover/phone:text-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="ml-1 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase"
              >
                Localização
              </Label>
              <div className="group/address relative">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-14 rounded-[20px] border-white/30 bg-white/50 pl-12 font-bold shadow-inner transition-all hover:bg-white/80 focus:ring-accent dark:border-slate-800/50 dark:bg-slate-950/30 dark:hover:bg-slate-950/50"
                  placeholder="Rua, Número, Bairro, Cidade"
                />
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-hover/address:text-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            "h-16 gap-4 rounded-full border-2 px-12 text-xs font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:shadow-accent/20 active:scale-95",
            success
              ? "border-emerald-400 bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
              : "border-slate-800 bg-slate-900 dark:border-white dark:bg-white dark:text-slate-900"
          )}
        >
          {isPending ? (
            "Processando..."
          ) : success ? (
            <>
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                className="h-6 w-6 animate-bounce"
              />
              Sincronizado!
            </>
          ) : (
            <>
              <HugeiconsIcon icon={FloppyDiskIcon} className="h-6 w-6" />
              Salvar Identidade
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
