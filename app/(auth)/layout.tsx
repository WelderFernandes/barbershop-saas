export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}
