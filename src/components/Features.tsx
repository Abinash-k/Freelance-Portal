import { motion } from "framer-motion";
import { Briefcase, Clock, FileText, Users } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Everything in One Place",
    description: "Manage all your freelance work from a single, intuitive dashboard.",
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Track time, set schedules, and optimize your productivity.",
  },
  {
    icon: FileText,
    title: "Professional Documents",
    description: "Create and manage contracts, invoices, and proposals effortlessly.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Organize client information, communications, and project details.",
  },
];

export const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            Why Choose Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto px-4 md:px-0"
          >
            A complete toolkit designed specifically for freelance success
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-8 md:w-12 h-8 md:h-12 text-[#D6BCFA] mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};