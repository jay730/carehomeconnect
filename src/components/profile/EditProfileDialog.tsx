
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters",
  }),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileDialogProps {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  onProfileUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ 
  userId, 
  firstName, 
  lastName, 
  phone, 
  onProfileUpdated,
  open,
  onOpenChange
}: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Combine first name and last name into a single display name
  const displayName = [firstName, lastName].filter(Boolean).join(' ');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: displayName || "",
      phone: phone || "",
      email: user?.email || "",
    },
  });

  // Reset form when dialog opens or props change
  useEffect(() => {
    if (open) {
      form.reset({
        displayName: [firstName, lastName].filter(Boolean).join(' ') || "",
        phone: phone || "",
        email: user?.email || "",
      });
    }
  }, [firstName, lastName, phone, user?.email, form, open]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    
    try {
      // Split display name into first name and last name
      const nameParts = data.displayName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: first_name,
          last_name: last_name,
          phone: data.phone || null
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        duration: 2000, // Explicitly set to 2 seconds
      });
      
      onOpenChange(false);
      onProfileUpdated();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
        duration: 2000, // Explicitly set to 2 seconds
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const userInitials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Login)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email address" 
                      {...field} 
                      disabled 
                      className="bg-muted cursor-not-allowed" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
