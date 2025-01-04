import { DollarSign, Clock, FileText, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPIData {
  totalRevenue: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  hoursTracked: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  pendingInvoices: {
    value: string;
    change: string;
    isPositive: boolean;
  };
  activeProjects: {
    value: string;
    change: string;
    isPositive: boolean;
  };
}

export const KPICards = ({ kpiData }: { kpiData: KPIData }) => {
  return (
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
  );
};