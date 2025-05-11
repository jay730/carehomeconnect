
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Files, Upload, Trash2, Image, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface PropertyMediaUploadProps {
  onUploadComplete: (urls: { photos: string[], video: string | null }) => void;
  propertyId?: string;
  existingPhotos?: string[];
  existingVideo?: string | null;
}

export const PropertyMediaUpload = ({ 
  onUploadComplete, 
  propertyId,
  existingPhotos = [], 
  existingVideo = null
}: PropertyMediaUploadProps) => {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [video, setVideo] = useState<string | null>(existingVideo);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Make sure we update our local state when props change
  useEffect(() => {
    setPhotos(existingPhotos);
    setVideo(existingVideo);
  }, [existingPhotos, existingVideo]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to upload photos");
      }

      const files = Array.from(e.target.files);
      if (photos.length + files.length > 10) {
        throw new Error("Maximum 10 photos allowed");
      }

      // Create the bucket if it doesn't exist yet (this shouldn't be needed anymore since we did it via SQL)
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'property_media')) {
        console.log("Bucket not found, creating it now");
        await supabase.storage.createBucket('property_media', {
          public: true
        });
      }

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `photos/${fileName}`;
          
          console.log("Uploading file to path:", filePath);
          
          const { data, error: uploadError } = await supabase.storage
            .from('property_media')
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`Upload error: ${uploadError.message}`);
          }

          if (!data?.path) {
            throw new Error("Upload failed - no path returned");
          }

          const { data: { publicUrl } } = supabase.storage
            .from('property_media')
            .getPublicUrl(data.path);

          // If this is a property with an ID, save this to the database
          if (propertyId) {
            console.log("Adding media to database for property:", propertyId);
            const isPrimary = photos.length === 0 && existingPhotos.length === 0;
            const { error: dbError } = await supabase.from('care_home_media').insert({
              care_home_id: propertyId,
              photo_url: publicUrl,
              is_primary: isPrimary
            });

            if (dbError) {
              console.error("Database error:", dbError);
              throw new Error(`Database error: ${dbError.message}`);
            }
          }

          return publicUrl;
        })
      );

      const newPhotos = [...photos, ...uploadedUrls];
      setPhotos(newPhotos);
      onUploadComplete({ photos: newPhotos, video });
      
      toast({
        title: "Photos uploaded",
        description: `${uploadedUrls.length} photo(s) uploaded successfully`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error uploading photos";
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Photo upload error:", err);
    } finally {
      setIsUploading(false);
    }
  }, [photos, video, propertyId, onUploadComplete, existingPhotos, toast]);

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to upload videos");
      }

      // Create the bucket if it doesn't exist yet (this shouldn't be needed anymore since we did it via SQL)
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'property_media')) {
        console.log("Bucket not found, creating it now");
        await supabase.storage.createBucket('property_media', {
          public: true
        });
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      console.log("Uploading video to path:", filePath);
      
      const { data, error: uploadError } = await supabase.storage
        .from('property_media')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      if (!data?.path) {
        throw new Error("Upload failed - no path returned");
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property_media')
        .getPublicUrl(data.path);
        
      // If this is a property with an ID, save this to the database
      if (propertyId) {
        console.log("Adding video to database for property:", propertyId);
        const { error: dbError } = await supabase.from('care_home_media').insert({
          care_home_id: propertyId,
          photo_url: publicUrl,
          video_url: publicUrl // Store video URL in both fields to identify it as a video
        });

        if (dbError) {
          console.error("Database error:", dbError);
          throw new Error(`Database error: ${dbError.message}`);
        }
      }

      setVideo(publicUrl);
      onUploadComplete({ photos, video: publicUrl });
      
      toast({
        title: "Video uploaded",
        description: "Your video was uploaded successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error uploading video";
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Video upload error:", err);
    } finally {
      setIsUploading(false);
    }
  }, [photos, propertyId, onUploadComplete, toast]);

  const handlePhotoDelete = useCallback(async (urlToDelete: string) => {
    setIsDeleting(true);
    try {
      // If we have a propertyId, we need to delete the record from the database
      if (propertyId) {
        // Get the filename from the URL
        const { error } = await supabase
          .from('care_home_media')
          .delete()
          .eq('photo_url', urlToDelete);
        
        if (error) throw error;
      }
      
      // Delete from Supabase storage if it's stored there
      if (urlToDelete.includes('property_media')) {
        try {
          const path = urlToDelete.split('property_media/')[1];
          if (path) {
            await supabase.storage
              .from('property_media')
              .remove([path]);
          }
        } catch (storageError) {
          // Log the error but don't stop the process
          console.error("Storage deletion error:", storageError);
        }
      }

      // Update local state
      const newPhotos = photos.filter(url => url !== urlToDelete);
      setPhotos(newPhotos);
      onUploadComplete({ photos: newPhotos, video });
      
      toast({
        title: "Photo deleted",
        description: "The photo has been removed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting photo";
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Photo deletion error:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [photos, video, propertyId, onUploadComplete, toast]);

  const handleVideoDelete = useCallback(async () => {
    if (!video) return;
    
    setIsDeleting(true);
    try {
      // If we have a propertyId, delete the record from the database
      if (propertyId) {
        const { error } = await supabase
          .from('care_home_media')
          .delete()
          .eq('video_url', video);
        
        if (error) throw error;
      }
      
      // Delete from Supabase storage if it's stored there
      if (video.includes('property_media')) {
        try {
          const path = video.split('property_media/')[1];
          if (path) {
            await supabase.storage
              .from('property_media')
              .remove([path]);
          }
        } catch (storageError) {
          // Log the error but don't stop the process
          console.error("Storage deletion error:", storageError);
        }
      }
      
      // Update local state
      setVideo(null);
      onUploadComplete({ photos, video: null });
      
      toast({
        title: "Video deleted",
        description: "The video has been removed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting video";
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Video deletion error:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [video, propertyId, photos, onUploadComplete, toast]);

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Photos ({photos.length}/10)</h3>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || photos.length >= 10}
            className="relative"
          >
            <Files className="mr-2" />
            Add Photos
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading || photos.length >= 10}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </Button>
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((url, index) => (
              <div key={url} className="relative group">
                <AspectRatio ratio={4/3} className="bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={url}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </AspectRatio>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/30 group-hover:opacity-100 transition-opacity rounded-md">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => handlePhotoDelete(url)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {photos.length === 0 && (
          <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
            <Image className="h-8 w-8 mb-2 opacity-50" />
            <p>No photos yet</p>
            <p className="text-xs">Upload photos to showcase your property</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Video {video ? "(1/1)" : "(0/1)"}</h3>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || !!video}
            className="relative"
          >
            <Upload className="mr-2" />
            Add Video
            <Input
              type="file"
              accept="video/*"
              disabled={isUploading || !!video}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleVideoUpload}
            />
          </Button>
        </div>
        {video ? (
          <div className="relative group">
            <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md overflow-hidden">
              <video
                src={video}
                controls
                className="w-full h-full object-contain rounded-md"
              />
            </AspectRatio>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/30 group-hover:opacity-100 transition-opacity rounded-md">
              <Button 
                variant="destructive" 
                size="sm"
                className="h-8 px-2"
                onClick={handleVideoDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
            <Video className="h-8 w-8 mb-2 opacity-50" />
            <p>No video yet</p>
            <p className="text-xs">Upload a video to show your property in action</p>
          </div>
        )}
      </div>
    </div>
  );
};
