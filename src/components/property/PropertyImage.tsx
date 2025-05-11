
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";

interface PropertyImageProps {
  image: string;
  name: string;
  className?: string;
  isOwner?: boolean;
  propertyId?: string;
  onImageUpdated?: (newImageUrl: string) => void;
  isEditing?: boolean;
}

const PropertyImage = ({ 
  image, 
  name, 
  className,
  isOwner = false,
  propertyId,
  onImageUpdated,
  isEditing = false
}: PropertyImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // Convert to MB
    
    // Validate file size (5MB max)
    if (fileSize > 5) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload image to Supabase Storage - using the correct bucket name "property_media"
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('property_media')
        .upload(`photos/${fileName}`, file);

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('property_media')
        .getPublicUrl(data.path);

      // Update the property's primary image in the database
      await supabase
        .from('care_home_media')
        .update({ is_primary: false })
        .eq('care_home_id', propertyId);
      
      const { error: insertError } = await supabase
        .from('care_home_media')
        .insert({
          care_home_id: propertyId,
          photo_url: urlData.publicUrl,
          is_primary: true
        });

      if (insertError) throw insertError;

      if (onImageUpdated) {
        onImageUpdated(urlData.publicUrl);
      }

      toast({
        title: "Image Updated",
        description: "The property image has been updated successfully",
        duration: 2000
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("rounded-lg overflow-hidden h-80 relative", className)}>
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
      
      {isOwner && isEditing && (
        <div className="absolute bottom-4 right-4">
          <input 
            type="file" 
            id="image-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading} 
          />
          <label htmlFor="image-upload">
            <Button 
              variant="default"
              className="bg-white/80 hover:bg-white text-black"
              disabled={isUploading}
              asChild
            >
              <span>
                <Camera className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Change Image"}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

export default PropertyImage;
