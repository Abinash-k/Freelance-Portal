import { motion } from "framer-motion";
import { 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  FileSpreadsheet,
  FileText,
  Users2
} from "lucide-react";

const dashboardFeatures = [
  {
    icon: ClipboardList,
    title: "Project Management",
    description: "Track projects, set milestones, and monitor progress all in one place.",
  },
  {
    icon: FileSpreadsheet,
    title: "Invoice Generation",
    description: "Create professional invoices and track payments effortlessly.",
  },
  {
    icon: Calendar,
    title: "Meeting Scheduler",
    description: "Schedule and manage client meetings with automated reminders.",
  },
  {
    icon: Users2,
    title: "Lead Management",
    description: "Track potential clients and manage your sales pipeline.",
  },
  {
    icon: FileText,
    title: "Contract Templates",
    description: "Create and manage professional contracts with ease.",
  },
  {
    icon: BarChart3,
    title: "Expense Tracking",
    description: "Monitor your business expenses and generate reports.",
  },
];

export const DashboardFeatures = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Powerful Dashboard Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to manage and grow your freelance business
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-secondary rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};