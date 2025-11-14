
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartPulse } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="relative min-h-screen w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover object-center"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
            <div className="mx-auto max-w-2xl rounded-lg bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
                <HeartPulse className="h-12 w-12 text-primary" />
                <h1 className="font-headline text-5xl font-bold text-primary">
                VitalSync
                </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
                Your partner in a healthy pregnancy journey.
            </p>
            <p className="mt-2 text-muted-foreground">
                Monitor your health, connect with your doctor, and stay informed every step of the way.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/login">Access Your Dashboard</Link>
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
