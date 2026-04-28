import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import AdminFloatButton from '@/components/admin-float-button';
import Footer from '@/components/footer';

// Importación de base de datos (según tu export default) y sesión
import prisma from '@/lib/db'; 
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });

// Forzamos renderizado dinámico para que los cambios en el Footer se vean al instante
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const metadataBase = process.env.NEXTAUTH_URL 
  ? new URL(process.env.NEXTAUTH_URL) 
  : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: 'Sii Goo Consultores | Gestoría y Contabilidad Analítica Profesional',
  description: 'Servicios profesionales de gestoría especializada en contabilidad analítica. Asesoría fiscal, laboral y contable para empresas de reformas y construcción.',
  keywords: 'gestoría, contabilidad analítica, asesoría fiscal, asesoría laboral, empresas reformas, gestión administrativa',
  openGraph: {
    title: 'Sii Goo Consultores | Gestoría y Contabilidad Analítica',
    description: 'Servicios profesionales de gestoría especializada en contabilidad analítica',
    images: ['/og-image.png'],
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Obtenemos la sesión del servidor para el modo administrador
  const session = await getServerSession();

  // 2. Traemos el contenido de la base de datos para sincronizar el Footer
  let dbContent: Record<string, string> = {};
  
  try {
    // Buscamos los registros de las páginas donde guardas el contacto
    const contentData = await prisma.siteContent.findMany({
      where: {
        page: { in: ['common', 'contacto', 'servicios'] }
      }
    });
    
    // Mapeamos el array de SiteContent a un objeto plano { section: content }
    dbContent = contentData.reduce((acc, item) => {
      acc[item.section] = item.content;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error al cargar SiteContent en RootLayout:", error);
  }

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          {/* Contenido principal de la página */}
          {children}
          
        
          <Footer 
            isAdmin={!!session} 
            dbContent={dbContent} 
          />
          
          {/* Botón flotante de admin (solo visible si hay sesión) */}
          <AdminFloatButton />
          
          {/* Notificaciones Toaster */}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}