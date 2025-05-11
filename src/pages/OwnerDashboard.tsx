
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOwnerProperties } from "@/hooks/useOwnerProperties";
import { PropertiesGrid } from "@/components/owner-dashboard/PropertiesGrid";
import { EmptyState } from "@/components/owner-dashboard/EmptyState";
import { DashboardHeader } from "@/components/owner-dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/spinner";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { properties, profile, isLoading, handleProfileUpdated } = useOwnerProperties();
  
  // Check for payment tab parameter
  useEffect(() => {
    const paymentTab = searchParams.get('paymentTab');
    if (paymentTab === 'true') {
      navigate('/profile?tab=payment');
    }
  }, [searchParams, navigate]);

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <DashboardHeader 
        profile={profile} 
        onProfileUpdated={handleProfileUpdated} 
      />

      {properties.length === 0 ? (
        <EmptyState />
      ) : (
        <PropertiesGrid properties={properties} />
      )}
    </div>
  );
};

export default OwnerDashboard;
