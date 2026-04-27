import Navbar from '@/components/navbar';
import EspecializationReformas from '@/components/especialization-reformas';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function ReformasPage() {
  // --- LÓGICA DEL CMS ---
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'admin';

  let dbContent: Record<string, string> = {};
  
  try {
    const rawContent = await prisma.siteContent.findMany({
      where: { page: 'reformas' } 
    });

    dbContent = rawContent.reduce((acc: any, item: { section: string; content: string }) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error cargando contenido de reformas:", error);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Pasamos los datos al componente especializado */}
        <EspecializationReformas isAdmin={isAdmin} dbContent={dbContent} />
      </div>
    </main>
  );
}