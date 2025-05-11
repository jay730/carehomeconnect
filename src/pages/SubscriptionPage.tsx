
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for success or canceled status from URL
  useEffect(() => {
    // Clean up URL params
    if (searchParams.has('success') || searchParams.has('canceled')) {
      navigate('/owner/subscription', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleBackToProfile = () => {
    // Navigate to profile page with the manage tab active
    navigate('/profile', { state: { activeTab: 'manage' } });
  };

  return (
    <div className="container py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="default" 
          onClick={handleBackToProfile} 
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>
      </div>
      <SubscriptionManager />
    </div>
  );
};

export default SubscriptionPage;
