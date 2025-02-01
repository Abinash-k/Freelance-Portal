import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
      <div className="container mx-auto text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/10 text-accent rounded-full"
        >
          Built for Freelancers Like You
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold mb-8 tracking-tight px-4 md:px-0 text-primary"
        >
          Your All-in-One <br className="hidden md:block" />
          Freelance Business Hub
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto px-4 md:px-0"
        >
          Manage clients, track time, send invoices, and grow your freelance business
          with our comprehensive platform designed specifically for independent professionals.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center px-4 md:px-0"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto text-lg py-6"
            onClick={() => navigate('/signin')}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto text-lg py-6"
            onClick={() => navigate('/signin')}
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
};