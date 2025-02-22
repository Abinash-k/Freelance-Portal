
import {
  LayoutDashboard,
  Clock,
  Users,
  Settings,
  HelpCircle,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Time Tracking",
    icon: Clock,
    url: "/time-tracking",
  },
  {
    title: "Leads",
    icon: Users,
    url: "/leads",
  },
  {
    title: "Invoices",
    icon: FileText,
    url: "/invoices/new",
  },
  {
    title: "Expenses",
    icon: DollarSign,
    url: "/expenses",
  },
  {
    title: "Meetings",
    icon: Calendar,
    url: "/meetings",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    url: "/support",
  },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
