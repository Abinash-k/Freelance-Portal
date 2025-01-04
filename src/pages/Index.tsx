import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </div>
    </div>
  );
};

export default Index;