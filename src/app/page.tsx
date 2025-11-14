
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartPulse } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Pane: Image */}
        <div className="relative hidden lg:block">
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
          <div className="absolute inset-0 bg-gradient-to-l from-background/10 via-background/80 to-background" />
        </div>

        {/* Right Pane: Content */}
        <div className="relative flex items-center justify-center p-4 lg:p-8">
           {/* Mobile background */}
          <div className="absolute inset-0 lg:hidden">
            {heroImage && (
                <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover object-center opacity-10"
                priority
                data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
          </div>
          
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="rounded-lg bg-card/80 p-8 shadow-2xl backdrop-blur-sm border border-border/50">
              <div className="flex items-center justify-center gap-3">
                <HeartPulse className="h-12 w-12 text-primary" />
                <h1 className="font-headline text-5xl font-bold text-primary">
                  VitalSync
                </h1>
              </div>
              <p className="mt-4 text-lg text-foreground">
                Your partner in a healthy pregnancy journey.
              </p>
              <p className="mt-2 text-muted-foreground">
                Monitor your health, connect with your doctor, and stay informed
                every step of the way.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/login">Access Your Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="http://13.60.211.180" target="_blank" rel="noopener noreferrer">
                    External Link
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
