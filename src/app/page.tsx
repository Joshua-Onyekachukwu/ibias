import Footer from "@/components/layout/footer";
import Hero from "./(landing)/components/hero";
import Features from "./(landing)/components/features";
import HowItWorks from "./(landing)/components/how-it-works";
import Testimonials from "./(landing)/components/testimonials";
import Pricing from "./(landing)/components/pricing";
import CTA from "./(landing)/components/cta";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation is now handled by MainNav in layout */}
      <div className="flex-1">
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="about">
          <CTA />
        </section>
      </div>
      <Footer />
    </div>
  );
}
