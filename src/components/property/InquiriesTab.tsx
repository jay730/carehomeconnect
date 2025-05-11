
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Inquiry {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  message: string;
  created_at: string;
  status: string | null;
}

// Define a type for grouped inquiries
interface GroupedInquiry {
  name: string;
  phone: string | null;
  email: string;
  messages: Array<{
    id: string;
    message: string;
    created_at: string;
  }>;
}

interface InquiriesTabProps {
  propertyId: string;
  isOwner: boolean;
  activeTab?: string;
}

const InquiriesTab = ({ propertyId, isOwner, activeTab }: InquiriesTabProps) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [groupedInquiries, setGroupedInquiries] = useState<GroupedInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Group inquiries by email
  const groupInquiriesByUser = (inquiries: Inquiry[]) => {
    const grouped: Record<string, GroupedInquiry> = {};
    
    inquiries.forEach(inquiry => {
      if (!grouped[inquiry.email]) {
        grouped[inquiry.email] = {
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          messages: []
        };
      }
      
      grouped[inquiry.email].messages.push({
        id: inquiry.id,
        message: inquiry.message,
        created_at: inquiry.created_at
      });
    });
    
    // Sort messages by date (newest first)
    Object.values(grouped).forEach(group => {
      group.messages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    
    // Convert to array and sort by the latest message date (newest inquiry first)
    return Object.values(grouped).sort((a, b) => 
      new Date(a.messages[0].created_at).getTime() - new Date(b.messages[0].created_at).getTime()
    ).reverse();
  };

  // Fetch inquiries when the component mounts or when activeTab changes to "inquiries"
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .eq('care_home_id', propertyId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setInquiries(data || []);
        setGroupedInquiries(groupInquiriesByUser(data || []));
        
        // Mark inquiries as viewed if owner is viewing them and the inquiries tab is active
        if (isOwner && activeTab === "inquiries") {
          const pendingInquiries = data ? data.filter(inquiry => inquiry.status === 'pending') : [];
          
          if (pendingInquiries.length > 0) {
            const pendingInquiryIds = pendingInquiries.map(inquiry => inquiry.id);
            
            // Update the status in Supabase
            const { error: updateError } = await supabase
              .from('inquiries')
              .update({ status: 'viewed' })
              .in('id', pendingInquiryIds);
              
            if (updateError) {
              console.error('Error updating inquiry status:', updateError);
              return;
            }
              
            // Update local state to reflect the change
            setInquiries(prevInquiries => 
              prevInquiries.map(inquiry => 
                pendingInquiryIds.includes(inquiry.id) 
                  ? { ...inquiry, status: 'viewed' } 
                  : inquiry
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInquiries();
    
    // Set up a real-time subscription to listen for new inquiries
    const channel = supabase
      .channel('inquiries-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'inquiries',
        filter: `care_home_id=eq.${propertyId}`
      }, (payload) => {
        // Add the new inquiry to the state
        const newInquiry = payload.new as Inquiry;
        setInquiries(prev => {
          const updated = [newInquiry, ...prev];
          setGroupedInquiries(groupInquiriesByUser(updated));
          return updated;
        });
        
        // Show a toast notification
        if (activeTab !== 'inquiries') {
          toast({
            title: "New Inquiry",
            description: `New inquiry received from ${newInquiry.name}`,
          });
        }
      })
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, isOwner, activeTab, toast]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">You need to be the owner of this property to view inquiries.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No inquiries have been received for this property yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Property Inquiries</h2>
        <div className="space-y-6">
          {groupedInquiries.map((inquiry) => (
            <div key={inquiry.email} className="border rounded-md p-4 bg-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{inquiry.name}</h3>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <p><span className="font-medium">Phone:</span> {inquiry.phone || 'Not provided'}</p>
                <p><span className="font-medium">Email:</span> {inquiry.email}</p>
              </div>
              <div className="mb-2">
                <p className="font-medium text-sm mb-1">Messages:</p>
                <div className="space-y-4">
                  {inquiry.messages.map((message) => (
                    <div key={message.id} className="border-t pt-3">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'MMM d, yyyy - h:mm a')}
                        </span>
                      </div>
                      <Textarea 
                        value={message.message} 
                        readOnly
                        className="bg-muted/30 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InquiriesTab;
