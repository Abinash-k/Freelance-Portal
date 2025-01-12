import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DashboardFeatures } from "@/components/DashboardFeatures";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <Features />
        <DashboardFeatures />
        <Pricing />
        <CTA />
      </div>
    </div>
  );
};

export default Index;