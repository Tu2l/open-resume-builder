import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/hooks/use-theme';
import { getAppInfo } from '@/lib/utils';

export const metadata: Metadata = {
  title: getAppInfo().name,
  description: 'AI-Powered Resume Creator',
  icons: {
    icon: [
      { url: '/open-resume-builder/favicon.svg', type: 'image/svg+xml' },
      { url: '/open-resume-builder/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/open-resume-builder/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/open-resume-builder/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/open-resume-builder/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
