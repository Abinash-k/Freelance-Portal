import { DollarSign, Clock, FileText, Briefcase, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-2">{kpiData.totalRevenue.value}</h3>
                  <p className={`text-sm mt-1 ${kpiData.totalRevenue.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.totalRevenue.change} vs last month
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Tracked</p>
                  <h3 className="text-2xl font-bold mt-2">{kpiData.hoursTracked.value}</h3>
                  <p className={`text-sm mt-1 ${kpiData.hoursTracked.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.hoursTracked.change} vs last month
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Invoices</p>
                  <h3 className="text-2xl font-bold mt-2">{kpiData.pendingInvoices.value}</h3>
                  <p className={`text-sm mt-1 ${kpiData.pendingInvoices.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.pendingInvoices.change} vs last month
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <h3 className="text-2xl font-bold mt-2">{kpiData.activeProjects.value}</h3>
                  <p className={`text-sm mt-1 ${kpiData.activeProjects.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.activeProjects.change} vs last month
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Active Projects</h2>
            </div>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {project.status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Due {project.dueDate}
                        </span>
                        <span>{project.hoursLogged} logged</span>
                        <span>{project.budget}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Tracker */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Time Tracker</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Entry
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <select className="w-full border rounded-md p-2">
                      <option>Select a project</option>
                      {projects.map((project, index) => (
                        <option key={index}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded-md p-2"
                      placeholder="What are you working on?"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full gap-2">
                    <Clock className="h-4 w-4" /> Start Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;