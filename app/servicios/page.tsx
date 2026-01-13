import Navbar from '@/components/navbar';
import Services from '@/components/services';
import Footer from '@/components/footer';

export default function ServiciosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
