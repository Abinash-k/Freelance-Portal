import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigation } from "@/components/Navigation";
import { KPICards } from "@/components/dashboard/KPICards";
import { ProjectsList } from "@/components/dashboard/ProjectsList";
import { TimeTracker } from "@/components/dashboard/TimeTracker";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  const kpiData = {
    totalRevenue: {
      value: "$24,500",
      change: "+12.5%",
      isPositive: true
    },
    hoursTracked: {
      value: "164h",
      change: "-2.3%",
      isPositive: false
    },
    pendingInvoices: {
      value: "6",
      change: "+8.1%",
      isPositive: true
    },
    activeProjects: {
      value: "8",
      change: "+4.2%",
      isPositive: true
    }
  };

  const projects = [
    {
      name: "Website Redesign",
      client: "Tech Corp",
      dueDate: "4/15/2024",
      hoursLogged: "45h",
      budget: "$12,000",
      progress: 75,
      status: "In Progress"
    },
    {
      name: "Mobile App Development",
      client: "StartUp Inc",
      dueDate: "5/1/2024",
      hoursLogged: "28h",
      budget: "$20,000",
      progress: 45,
      status: "In Progress"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <KPICards kpiData={kpiData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Active Projects</h2>
                </div>
                <ProjectsList projects={projects} />
              </div>
              <div>
                <TimeTracker projects={projects} />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;