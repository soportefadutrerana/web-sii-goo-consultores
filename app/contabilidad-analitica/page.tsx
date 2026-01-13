import Navbar from '@/components/navbar';
import ContabilidadAnalitica from '@/components/contabilidad-analitica';
import Footer from '@/components/footer';

export default function ContabilidadAnaliticaPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <ContabilidadAnalitica />
      </div>
      <Footer />
    </main>
  );
}
