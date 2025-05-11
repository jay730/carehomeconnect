
import { Card, CardContent } from "@/components/ui/card";
import EditPropertyForm from "./EditPropertyForm";
import { PropertyMediaUpload } from "@/components/PropertyMediaUpload";

interface PropertyEditFormProps {
  propertyId: string;
  propertyName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  capacity: number;
  existingPhotos: string[];
  existingVideo: string | null;
  onSave: (updatedProperty: any) => void; 
  onCancel: () => void;
  onMediaUploadComplete: (urls: { photos: string[], video: string | null }) => void;
}

const PropertyEditForm = ({
  propertyId,
  propertyName,
  description,
  address,
  city,
  state,
  zip_code,
  price,
  capacity,
  existingPhotos,
  existingVideo,
  onSave,
  onCancel,
  onMediaUploadComplete
}: PropertyEditFormProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Edit Property Details</h2>
        <EditPropertyForm 
          property={{
            id: propertyId,
            name: propertyName,
            description,
            location: `${address}, ${city}, ${state} ${zip_code}`,
            price,
            capacity,
            address,
            city,
            state,
            zip_code
          }} 
          onSave={onSave} 
          onCancel={onCancel} 
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Property Media</h3>
          <PropertyMediaUpload 
            onUploadComplete={onMediaUploadComplete} 
            propertyId={propertyId} 
            existingPhotos={existingPhotos} 
            existingVideo={existingVideo} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyEditForm;
