import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegisterSuccessPage() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Your broker account has been created.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You&apos;re all set to start listing properties. Welcome to EstateHub!
      </p>
      <Button asChild className="mt-8 w-full">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have listings to manage?{' '}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
