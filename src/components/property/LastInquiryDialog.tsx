
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface LastInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    created_at: string;
    status?: string;
  };
  propertyName: string;
}

const LastInquiryDialog = ({
  open,
  onOpenChange,
  inquiry,
  propertyName
}: LastInquiryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            Your inquiry for {propertyName} sent on {format(new Date(inquiry.created_at), 'MMMM d, yyyy h:mm a')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="font-medium">
              {inquiry.status === 'pending' 
                ? 'Pending Review' 
                : inquiry.status === 'viewed' 
                ? 'Viewed by Owner' 
                : 'Processed'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{inquiry.name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{inquiry.email}</p>
            </div>

            {inquiry.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{inquiry.phone}</p>
              </div>
            )}
          </div>

          {inquiry.message && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Message</p>
              <div className="mt-1 p-3 bg-muted/30 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LastInquiryDialog;
