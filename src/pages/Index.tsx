import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DashboardFeatures } from "@/components/DashboardFeatures";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div>
        <Hero />
        <Features />
        <DashboardFeatures />
        <CTA />
      </div>
    </div>
  );
};

export default Index;