import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

const metadataBase = process.env.NEXTAUTH_URL 
  ? new URL(process.env.NEXTAUTH_URL) 
  : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: 'SIi Goo Consultores | Gestoría y Contabilidad Analítica Profesional',
  description: 'Servicios profesionales de gestoría especializada en contabilidad analítica. Asesoría fiscal, laboral y contable para empresas de reformas y construcción.',
  keywords: 'gestoría, contabilidad analítica, asesoría fiscal, asesoría laboral, empresas reformas, gestión administrativa',
  openGraph: {
    title: 'SIi Goo Consultores | Gestoría y Contabilidad Analítica',
    description: 'Servicios profesionales de gestoría especializada en contabilidad analítica',
    images: ['/og-image.png'],
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
