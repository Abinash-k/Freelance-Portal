import { Plus, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  name: string;
}

export const TimeTracker = ({ projects }: { projects: Project[] }) => {
  return (
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
  );
};