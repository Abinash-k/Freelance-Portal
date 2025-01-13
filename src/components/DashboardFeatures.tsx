import { motion } from "framer-motion";
import {
  ClipboardList,
  FileText,
  Calendar,
  Users,
  ScrollText,
  Receipt,
} from "lucide-react";

const features = [
  {
    title: "Project Management",
    description:
      "Track projects, set milestones, and manage deliverables efficiently.",
    icon: ClipboardList,
    href: "/dashboard",
  },
  {
    title: "Invoice Generation",
    description:
      "Create and manage professional invoices with automated calculations.",
    icon: FileText,
    href: "/invoices",
  },
  {
    title: "Meeting Scheduler",
    description: "Schedule and manage client meetings with automated reminders.",
    icon: Calendar,
    href: "/meetings",
  },
  {
    title: "Lead Management",
    description: "Track and nurture potential client relationships effectively.",
    icon: Users,
    href: "/leads",
  },
  {
    title: "Contract Templates",
    description: "Access and customize professional contract templates.",
    icon: ScrollText,
    href: "/contracts",
  },
  {
    title: "Expense Tracking",
    description: "Monitor and categorize business expenses with ease.",
    icon: Receipt,
    href: "/expenses",
  },
];

export const DashboardFeatures = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Comprehensive Tools for Freelancers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground mt-4">
            Everything you need to manage your freelance business efficiently in one
            place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-secondary rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};