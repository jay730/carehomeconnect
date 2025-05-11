
import { useState } from "react";
import PropertyInformation from "./PropertyInformation";
import PropertyContactInfo from "./PropertyContactInfo";
import PropertyMediaThumbnails from "./PropertyMediaThumbnails";
import PropertyEditForm from "./PropertyEditForm";
import { usePropertyMedia } from "@/hooks/usePropertyMedia";

interface PropertyDetailsTabProps {
  description: string;
  price: number;
  capacity: number;
  active: boolean;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  userRole?: string;
  isOwner?: boolean;
  propertyId: string;
  propertyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  onPropertyUpdated?: (updatedProperty: Partial<any>) => void;
  onMediaUpdated?: (urls: {
    photos: string[];
    video: string | null;
  }) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isAuthenticated?: boolean;
  user?: any;
}

const PropertyDetailsTab = ({
  description,
  price,
  capacity,
  active,
  owner,
  userRole,
  isOwner = false,
  propertyId,
  propertyName = "",
  address = "",
  city = "",
  state = "",
  zip_code = "",
  onPropertyUpdated,
  onMediaUpdated,
  isEditing,
  setIsEditing,
  isAuthenticated = false,
  user
}: PropertyDetailsTabProps) => {
  // User data to prepopulate the contact form
  const userData = {
    name: user?.user_metadata?.first_name && user?.user_metadata?.last_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : '',
    email: user?.email || '',
  };

  // Use the hook to fetch media
  const { existingPhotos, existingVideo } = usePropertyMedia(propertyId);
  
  const handleSave = (updatedProperty: any) => {
    setIsEditing(false);
    if (onPropertyUpdated) {
      onPropertyUpdated(updatedProperty);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleMediaUploadComplete = (urls: {
    photos: string[];
    video: string | null;
  }) => {
    if (onMediaUpdated) {
      onMediaUpdated(urls);
    }
  };
  
  if (isEditing && isOwner) {
    return (
      <PropertyEditForm
        propertyId={propertyId}
        propertyName={propertyName}
        description={description}
        address={address}
        city={city}
        state={state}
        zip_code={zip_code}
        price={price}
        capacity={capacity}
        existingPhotos={existingPhotos}
        existingVideo={existingVideo}
        onSave={handleSave}
        onCancel={handleCancel}
        onMediaUploadComplete={handleMediaUploadComplete}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <PropertyInformation
          description={description}
          price={price}
          capacity={capacity}
          active={active}
          isAuthenticated={isAuthenticated}
        />
        
        {/* Property Media Thumbnails */}
        {(existingPhotos.length > 0 || existingVideo) && (
          <div className="mt-6">
            <PropertyMediaThumbnails 
              photos={existingPhotos} 
              video={existingVideo} 
            />
          </div>
        )}
      </div>
      
      <div>
        <PropertyContactInfo
          owner={owner}
          userRole={userRole}
          active={active}
          propertyId={propertyId}
          propertyName={propertyName}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsTab;
