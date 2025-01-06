import { Calendar, Clock, Users, Video } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  attendees: string[];
  status: string;
  location: string;
}

interface MeetingsTableProps {
  meetings: Meeting[];
  isLoading: boolean;
}

export const MeetingsTable = ({ meetings, isLoading }: MeetingsTableProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Meeting Details</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Attendees</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meetings.map((meeting) => (
          <TableRow key={meeting.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {meeting.title}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(meeting.date), "PPp")}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {meeting.duration} minutes
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {meeting.attendees?.length || 0} attendees
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  meeting.status === "scheduled"
                    ? "secondary"
                    : meeting.status === "completed"
                    ? "outline"
                    : "default"
                }
              >
                {meeting.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" asChild>
                <a href={meeting.location} target="_blank" rel="noopener noreferrer">
                  Join Meeting
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};