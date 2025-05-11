import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePropertyMedia = (propertyId: string) => {
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      const fetchMedia = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('care_home_media')
            .select('*')
            .eq('care_home_id', propertyId);
            
          if (error) {
            console.error('Error fetching media:', error);
            return;
          }
          
          if (data) {
            // Sort so primary image comes first
            const sortedData = [...data].sort((a, b) => {
              if (a.is_primary) return -1;
              if (b.is_primary) return 1;
              return 0;
            });
            
            const photos: string[] = [];
            let video: string | null = null;
            
            sortedData.forEach(item => {
              if (item.video_url) {
                // If it has a video_url, treat it as a video
                video = item.video_url;
              } else if (item.photo_url) {
                // Otherwise treat it as a photo
                photos.push(item.photo_url);
              }
            });
            
            setExistingPhotos(photos);
            setExistingVideo(video);
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchMedia();
    }
  }, [propertyId]);

  return { existingPhotos, existingVideo, isLoading };
};
