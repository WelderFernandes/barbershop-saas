"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBarbershop } from "@/lib/actions/barbershop";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  CheckmarkBadge01Icon, 
  FloppyDiskIcon, 
  Store01Icon, 
  ContactIcon, 
  Location01Icon,
  Link01Icon,
  Camera01Icon,
  ImageAdd02Icon
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface GeneralFormProps {
  initialData: {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    address: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
  };
}

export function GeneralForm({ initialData }: GeneralFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "");
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || "");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') setLogoUrl(reader.result as string);
      else setCoverUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateBarbershop({
          id: initialData.id,
          name,
          phone,
          address,
          logoUrl,
          coverUrl,
        });
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        alert("Erro ao salvar: " + (error instanceof Error ? error.message : "Desconhecido"));
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* Branding Section (Glassmorphic) */}
      <div className="relative group perspective-1000">
        <div className="relative h-64 w-full rounded-[40px] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl bg-muted/20">
          {/* Cover Image */}
          {coverUrl ? (
            <img src={coverUrl} alt="Capa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-accent/20 via-background to-accent/5 flex items-center justify-center">
               <HugeiconsIcon icon={ImageAdd02Icon} className="w-12 h-12 text-accent/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
             <Button 
                type="button" 
                variant="secondary"
                onClick={() => coverInputRef.current?.click()}
                className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
             >
                <HugeiconsIcon icon={Camera01Icon} className="w-4 h-4 mr-2" />
                Alterar Capa
             </Button>
          </div>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
        </div>

        {/* Logo (Avatar) */}
        <div className="absolute -bottom-12 left-10 group/logo">
            <div className="relative h-32 w-32 rounded-[32px] overflow-hidden border-4 border-background bg-muted shadow-2xl ring-1 ring-white/20">
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                        <HugeiconsIcon icon={Store01Icon} className="w-10 h-10 text-accent" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    <HugeiconsIcon icon={Camera01Icon} className="w-6 h-6 text-white" />
                </div>
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
            </div>
        </div>

        <div className="absolute top-6 right-10 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Identidade Visual</p>
        </div>
      </div>

      {/* Grid de Informações Glassmorphic */}
      <div className="grid gap-8 md:grid-cols-2 pt-10">
        <div className="space-y-8 p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl shadow-accent/5">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nome da Barbearia</Label>
                    <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 rounded-[20px] bg-white/50 dark:bg-slate-950/30 border-white/30 dark:border-slate-800/50 font-bold text-lg focus:ring-accent transition-all hover:bg-white/80 dark:hover:bg-slate-950/50 shadow-inner"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Slug (Identificador)</Label>
                    <div className="relative group/slug">
                        <Input 
                            value={initialData.slug}
                            disabled
                            className="h-14 rounded-[20px] bg-muted/10 border-dashed border-border/50 font-mono text-xs opacity-60 cursor-not-allowed pl-12"
                        />
                        <HugeiconsIcon icon={Link01Icon} className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-hover/slug:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8 p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl shadow-accent/5">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contato WhatsApp</Label>
                    <div className="relative group/phone">
                        <Input 
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-14 rounded-[20px] bg-white/50 dark:bg-slate-950/30 border-white/30 dark:border-slate-800/50 font-bold pl-12 focus:ring-accent transition-all hover:bg-white/80 dark:hover:bg-slate-950/50 shadow-inner"
                            placeholder="(00) 00000-0000"
                        />
                        <HugeiconsIcon icon={ContactIcon} className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover/phone:text-accent transition-colors" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Localização</Label>
                     <div className="relative group/address">
                        <Input 
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="h-14 rounded-[20px] bg-white/50 dark:bg-slate-950/30 border-white/30 dark:border-slate-800/50 font-bold pl-12 focus:ring-accent transition-all hover:bg-white/80 dark:hover:bg-slate-950/50 shadow-inner"
                            placeholder="Rua, Número, Bairro, Cidade"
                        />
                        <HugeiconsIcon icon={Location01Icon} className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover/address:text-accent transition-colors" />
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
            "rounded-full px-12 h-16 font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all gap-4 border-2 hover:shadow-accent/20",
            success 
                ? "bg-emerald-500 border-emerald-400 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                : "bg-slate-900 border-slate-800 dark:bg-white dark:border-white dark:text-slate-900"
          )}
        >
          {isPending ? (
            "Processando..."
          ) : success ? (
            <>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-6 h-6 animate-bounce" />
              Sincronizado!
            </>
          ) : (
            <>
              <HugeiconsIcon icon={FloppyDiskIcon} className="w-6 h-6" />
              Salvar Identidade
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
