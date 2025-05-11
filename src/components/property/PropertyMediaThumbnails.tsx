
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyMediaThumbnailsProps {
  photos: string[];
  video: string | null;
}

const PropertyMediaThumbnails = ({
  photos,
  video
}: PropertyMediaThumbnailsProps) => {
  if (!photos.length && !video) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Media</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div key={photo} className="relative">
            <AspectRatio ratio={4 / 3} className="bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={photo} 
                alt={`Property photo ${index + 1}`} 
                className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity cursor-pointer" 
                onClick={() => window.open(photo, "_blank")} 
              />
            </AspectRatio>
            {index === 0 && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </div>
        ))}
        
        {video && (
          <div className="relative">
            <AspectRatio ratio={4 / 3} className="bg-gray-100 rounded-md overflow-hidden">
              <video 
                src={video} 
                className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity cursor-pointer" 
                onClick={() => window.open(video, "_blank")} 
                poster={photos[0] || undefined} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/50 p-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
              </div>
            </AspectRatio>
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMediaThumbnails;
