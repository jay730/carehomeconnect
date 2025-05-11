
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, Banknote, Home } from "lucide-react";
import { ProfileInfoTab } from "@/components/profile/ProfileInfoTab";
import { PaymentSettingsTab } from "@/components/profile/PaymentSettingsTab";
import { BankDetailsTab } from "@/components/profile/BankDetailsTab";
import { ManageSubscriptionTab } from "@/components/profile/ManageSubscriptionTab";
import { useProfileData } from "@/hooks/useProfileData";

export default function ProfilePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Check if we have a tab parameter in the location state
    return location.state?.activeTab || "profile";
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, fetchProfileData } = useProfileData(user?.id);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Fetch fresh profile data
  const handleProfileUpdated = async () => {
    if (!user) return;
    fetchProfileData();
  };

  // Only show bank details tab for owners
  const isOwner = profile?.role === "owner";

  return (
    <div className="container py-8 px-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className={`w-full grid ${isOwner ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Manage Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment Settings</span>
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              <span>Bank Details</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="pt-4">
          <ProfileInfoTab 
            user={user} 
            onProfileUpdated={handleProfileUpdated} 
          />
        </TabsContent>
        
        <TabsContent value="manage" className="pt-4">
          <ManageSubscriptionTab user={user} />
        </TabsContent>

        <TabsContent value="payment" className="pt-4">
          <PaymentSettingsTab user={user} />
        </TabsContent>

        {isOwner && (
          <TabsContent value="bank" className="pt-4">
            <BankDetailsTab user={user} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
