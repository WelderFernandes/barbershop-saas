import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function PublicBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen bg-[#F2F2F7] dark:bg-black font-sans antialiased", poppins.variable)}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        {children}
      </main>
    </div>
  );
}
