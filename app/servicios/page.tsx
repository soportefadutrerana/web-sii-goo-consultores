import Navbar from '@/components/navbar';
import Services from '@/components/services';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function ServiciosPage() {
  // --- LÓGICA DEL CMS ---
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'admin';

  let dbContent: Record<string, string> = {};
  
  try {
    const rawContent = await prisma.siteContent.findMany({
      where: { page: 'servicios' } // Buscamos los textos de la página servicios
    });

    dbContent = rawContent.reduce((acc: any, item: { section: string; content: string }) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error cargando contenido de servicios:", error);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Pasamos los poderes al componente Services */}
        <Services isAdmin={isAdmin} dbContent={dbContent} />
      </div>
    </main>
  );
}