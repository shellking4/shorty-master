import { UrlShortener } from '@/components/url-shortener';
import { BackgroundEffects } from '@/components/ui/background-effects';
import { PageHeader } from '@/components/layout/page-header';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900">
      <BackgroundEffects />
      
      <div className="container relative mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <PageHeader 
            title="ShortMe™"
            description="Transform your long URLs into short, shareable links in seconds"
          />
          <div className="flex justify-center">
            <UrlShortener />
          </div>
        </div>
      </div>
    </main>
  );
}