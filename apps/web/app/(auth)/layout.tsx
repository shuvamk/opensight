import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.3),transparent)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur">
              <span className="text-white font-bold text-xs tracking-wider">OS</span>
            </div>
            <span className="font-semibold text-lg">OpenSight</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-balance">
              Track your brand&apos;s AI visibility across every engine.
            </h2>
            <p className="text-primary-300 text-lg leading-relaxed max-w-md">
              Monitor ChatGPT, Perplexity, and Google AI Overviews. 
              Know exactly how AI talks about your brand.
            </p>
          </div>

          <p className="text-primary-400 text-sm">
            &copy; {new Date().getFullYear()} OpenSight. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
