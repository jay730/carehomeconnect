
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfileData } from "@/hooks/useProfileData";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileInfoTabProps {
  user: any;
  onProfileUpdated?: () => Promise<void>;
}

export function ProfileInfoTab({ user, onProfileUpdated }: ProfileInfoTabProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { profile, isLoading, updateProfile } = useProfileData(user?.id);

  // Handle opening the edit dialog
  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  // Handle saving profile changes
  const handleSaveProfile = async (formData: any) => {
    const success = await updateProfile(formData);
    if (success && onProfileUpdated) {
      await onProfileUpdated();
    }
    return success;
  };

  // Formatted display name
  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return "Your Name";
  };

  // Get initials for avatar
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return "U";
  };

  console.log("Current profile in ProfileInfoTab:", profile);

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <Card className="border-0 shadow-none">
        <CardContent className="px-0 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarFallback className="bg-care-100 text-care-800">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{getFullName()}</h3>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{getFullName()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile?.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{profile?.role || "User"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleEditProfile} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {profile && (
        <EditProfileDialog 
          userId={profile.id}
          firstName={profile.first_name || ""}
          lastName={profile.last_name || ""}
          phone={profile.phone || ""}
          onProfileUpdated={() => onProfileUpdated && onProfileUpdated()}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}
