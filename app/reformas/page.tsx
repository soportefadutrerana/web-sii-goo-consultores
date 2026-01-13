import Navbar from '@/components/navbar';
import EspecializationReformas from '@/components/especialization-reformas';
import Footer from '@/components/footer';

export default function ReformasPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <EspecializationReformas />
      </div>
      <Footer />
    </main>
  );
}
