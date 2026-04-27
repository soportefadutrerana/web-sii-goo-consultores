import Navbar from '@/components/navbar';
import ContabilidadAnalitica from '@/components/contabilidad-analitica';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function ContabilidadAnaliticaPage() {
  // --- LÓGICA DEL CMS ---
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'admin';

  let dbContent: Record<string, string> = {};
  
  try {
    const rawContent = await prisma.siteContent.findMany({
      where: { page: 'contabilidad' } // Filtramos por el contenido de esta página
    });

    dbContent = rawContent.reduce((acc: any, item: { section: string; content: string }) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error cargando contenido de contabilidad:", error);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Pasamos los datos al componente */}
        <ContabilidadAnalitica isAdmin={isAdmin} dbContent={dbContent} />
      </div>
    </main>
  );
}