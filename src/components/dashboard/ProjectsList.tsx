import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  name: string;
  client: string;
  dueDate: string;
  hoursLogged: string;
  budget: string;
  progress: number;
  status: string;
}

export const ProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
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
  );
};