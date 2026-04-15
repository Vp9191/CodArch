import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Guides from '../components/Guides';
import Footer from '../components/Footer';

export default function Landing() {
  console.log('[CodArch] Landing page rendered');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Guides />
      </main>
      <Footer />
    </div>
  );
}
