
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import ContactTourDialog from "./ContactTourDialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import LastInquiryDialog from "./LastInquiryDialog";

interface PropertyContactInfoProps {
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  userRole?: string;
  active: boolean;
  propertyId: string;
  propertyName: string;
  userData: {
    name: string;
    email: string;
  };
}

interface Inquiry {
  id: string;
  created_at: string;
  message?: string;
  status?: string;
  name: string;
  email: string;
  phone?: string;
}

const PropertyContactInfo = ({
  owner,
  userRole,
  active,
  propertyId,
  propertyName,
  userData
}: PropertyContactInfoProps) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [lastInquiryDialogOpen, setLastInquiryDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInquiries = async () => {
      if (!userRole || userRole !== "family") return;

      try {
        setLoading(true);
        const { data: user } = await supabase.auth.getUser();
        
        if (user?.user) {
          // Get all inquiries for this property by this user
          const { data: inquiries, error } = await supabase
            .from('inquiries')
            .select('*')
            .eq('care_home_id', propertyId)
            .eq('user_id', user.user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setUserInquiries(inquiries || []);
          
          // Set the most recent inquiry if available for backward compatibility
          if (inquiries && inquiries.length > 0) {
            setSelectedInquiry(inquiries[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInquiries();
  }, [propertyId, userRole]);

  const handleInquiryClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setLastInquiryDialogOpen(true);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        <ul className="space-y-4">
          <li>
            <p className="font-medium">{owner.name}</p>
            <p className="text-gray-600">Care Home Owner</p>
          </li>
          <Separator />
          <li>
            <p className="font-medium">{owner.phone}</p>
            <p className="text-gray-600">Phone</p>
          </li>
          <li>
            <p className="font-medium">{owner.email}</p>
            <p className="text-gray-600">Email</p>
          </li>
        </ul>
        
        {userRole === "family" && active && (
          <div className="mt-6 space-y-3">
            {/* Display all inquiries if they exist */}
            {userInquiries.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Your Inquiries</h3>
                {userInquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id} 
                    className="bg-muted/40 p-3 rounded-md text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <span className="font-medium">Inquiry Sent On:</span> {format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleInquiryClick(inquiry)}
                    >
                      Show
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              className="w-full"
              onClick={() => setContactDialogOpen(true)}
              disabled={loading || userInquiries.length >= 3}
            >
              {userInquiries.length >= 3 ? "Maximum Inquiries Sent (3)" : "Inquiry"}
            </Button>
          </div>
        )}
          
        {/* Contact Dialog */}
        <ContactTourDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          propertyId={propertyId}
          propertyName={propertyName}
          userData={userData}
          onSuccess={() => {
            // Refresh the inquiries count and last inquiry
            // We set a temporary object until the page refreshes
            const newInquiry: Inquiry = {
              id: Date.now().toString(), // temporary ID
              created_at: new Date().toISOString(),
              name: userData.name,
              email: userData.email,
              status: 'pending'
            };
            
            setUserInquiries(prev => [newInquiry, ...prev]);
          }}
        />

        {/* Inquiry Dialog */}
        {selectedInquiry && (
          <LastInquiryDialog
            open={lastInquiryDialogOpen}
            onOpenChange={setLastInquiryDialogOpen}
            inquiry={selectedInquiry}
            propertyName={propertyName}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyContactInfo;
