import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-[#33C3F0]"
          >
            FreelanceHub
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            <Button variant="link" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="link" onClick={() => navigate('/features')}>
              Features
            </Button>
            <Button variant="link" onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
            <Button 
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
          </div>
          <Button 
            className="md:hidden"
            variant="ghost"
            size="icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};