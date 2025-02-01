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
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Why Choose Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0"
          >
            A complete toolkit designed specifically for freelance success
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 md:p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};