import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-12 lg:flex">
        <Link href="/login" className="flex items-center gap-2 text-primary-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold">
            Estate<span className="text-primary-foreground/70">Hub</span>
          </span>
        </Link>
        <div className="max-w-md text-primary-foreground">
          <h1 className="font-display text-4xl font-bold leading-tight">
            List smarter. Share faster. Close more deals.
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            The all-in-one platform for real estate brokers — create AI-powered
            listings, share via WhatsApp, and manage your pipeline with ease.
          </p>
          <div className="mt-8 flex gap-6 text-sm text-primary-foreground/70">
            <div>
              <p className="font-display text-2xl font-bold text-primary-foreground">5,000+</p>
              <p>Active brokers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary-foreground">50,000+</p>
              <p>Properties listed</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary-foreground">2M+</p>
              <p>Buyer visits</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} EstateHub. All rights reserved.
        </p>
      </div>

      {/* Right content */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/login" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Estate<span className="text-primary">Hub</span>
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
