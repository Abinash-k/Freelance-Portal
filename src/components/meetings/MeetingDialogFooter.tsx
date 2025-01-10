import { Button } from "@/components/ui/button";

interface MeetingDialogFooterProps {
  onCancel: () => void;
  isProcessing: boolean;
  isEditing: boolean;
}

export const MeetingDialogFooter = ({ 
  onCancel, 
  isProcessing, 
  isEditing 
}: MeetingDialogFooterProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isProcessing}>
        {isEditing ? "Update" : "Schedule"} Meeting
      </Button>
    </div>
  );
};