import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigation } from "@/components/Navigation";
import { KPICards } from "@/components/dashboard/KPICards";
import { ProjectsList } from "@/components/dashboard/ProjectsList";
import { TimeTracker } from "@/components/dashboard/TimeTracker";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("Current user ID:", user.id);
      }
    };
    getUserId();
  }, []);

  // Fetch user's contracts
  const { data: contracts } = useQuery({
    queryKey: ['contracts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Fetch user's invoices
  const { data: invoices } = useQuery({
    queryKey: ['invoices', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Calculate KPI data based on user's data
  const kpiData = {
    totalRevenue: {
      value: `$${invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0).toLocaleString() || '0'}`,
      change: "+12.5%",
      isPositive: true
    },
    hoursTracked: {
      value: "164h",
      change: "-2.3%",
      isPositive: false
    },
    pendingInvoices: {
      value: invoices?.filter(inv => inv.status === 'pending')?.length.toString() || '0',
      change: "+8.1%",
      isPositive: true
    },
    activeProjects: {
      value: contracts?.filter(contract => contract.status === 'active')?.length.toString() || '0',
      change: "+4.2%",
      isPositive: true
    }
  };

  console.log("Rendered dashboard with contracts:", contracts);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>
            <KPICards kpiData={kpiData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">Active Projects</h2>
                </div>
                <ProjectsList />
              </div>
              <div className="w-full">
                <TimeTracker />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;