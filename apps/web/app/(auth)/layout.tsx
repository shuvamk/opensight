import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <Card className="w-full max-w-md">
        {children}
      </Card>
    </div>
  );
}
