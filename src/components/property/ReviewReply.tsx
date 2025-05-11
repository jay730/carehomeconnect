
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Reply } from "lucide-react";

interface ReviewReplyProps {
  reviewId: string;
  propertyOwnerId: string;
  existingReply?: string | null;
}

const ReviewReply = ({ reviewId, propertyOwnerId, existingReply }: ReviewReplyProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(existingReply || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSaving(true);
    try {
      // For demonstration purposes, we'll just simulate the API call
      // In a real implementation, you would save this to your database
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Toast notifications have been removed
      
      setIsReplying(false);
    } catch (error) {
      console.error("Error saving reply:", error);
      // Toast notifications have been removed
    } finally {
      setIsSaving(false);
    }
  };

  // If there's already a reply, show it
  if (existingReply && !isReplying) {
    return (
      <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
        <p className="text-sm font-medium text-gray-700">Owner Response:</p>
        <p className="text-gray-600 mt-1">{existingReply}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsReplying(true)}
          className="mt-2"
        >
          Edit Response
        </Button>
      </div>
    );
  }

  // If actively replying
  if (isReplying) {
    return (
      <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
        <p className="text-sm font-medium mb-2">Your Response:</p>
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your response here..."
          className="mb-2"
        />
        <div className="flex space-x-2">
          <Button 
            onClick={handleSubmitReply} 
            disabled={isSaving || !replyText.trim()}
            size="sm"
          >
            {isSaving ? "Saving..." : "Save Reply"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsReplying(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Reply button
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setIsReplying(true)}
      className="mt-2"
    >
      <Reply className="mr-1 h-4 w-4" />
      Reply to Review
    </Button>
  );
};

export default ReviewReply;
