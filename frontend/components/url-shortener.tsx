'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShortenRequest, urlSchema } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, Copy, Loader2 } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';
import { API_CONFIG } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Toaster, toast } from 'sonner';

export function UrlShortener() {
  const [token, setToken] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<ShortenRequest>({
    resolver: zodResolver(urlSchema),
  });

  useEffect(() => {
    getAuthToken()
      .then(setToken)
      .catch(() => toast.error('Failed to initialize service'))
      .finally(() => setIsInitializing(false));
  }, []);

  async function onSubmit(data: ShortenRequest) {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHORTEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      
      const json = await response.json();
      setShortUrl(json.short_url);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (isInitializing) {
    return (
      <Card className="w-full max-w-md p-6 backdrop-blur-xl bg-black/20 border-white/10 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-400">Initializing service...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-6 backdrop-blur-xl bg-black/20 border-white/10 shadow-2xl">
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <Link className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-100">Shorten Your URL</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-gray-300">URL to shorten</Label>
          <Input
            id="url"
            type="url"
            placeholder="Enter your URL"
            {...register('url')}
            className="bg-black/30 border-white/10 placeholder:text-gray-500"
          />
          {errors.url && (
            <p className="text-sm text-red-400">{errors.url.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>
      {shortUrl !== '' && (
        <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300 truncate">{shortUrl}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="hover:bg-white/5"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}