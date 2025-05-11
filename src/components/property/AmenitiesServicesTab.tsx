
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface AmenitiesServicesTabProps {
  amenities: string[];
  careServices: string[];
  isOwner?: boolean;
  propertyId?: string;
  onUpdate?: (updatedData: {
    amenities?: string[];
    careServices?: string[];
  }) => void;
  isEditing: boolean;
}

// Define all available amenities and care services
const allAmenities = [{
  id: "private_rooms",
  label: "Private Rooms"
}, {
  id: "ensuite_rooms",
  label: "Ensuite Bathrooms"
}, {
  id: "garden",
  label: "Beautiful Garden"
}, {
  id: "communal_dining",
  label: "Communal Dining"
}, {
  id: "entertainment_area",
  label: "Entertainment Area"
}, {
  id: "housekeeping",
  label: "Housekeeping"
}, {
  id: "laundry",
  label: "Laundry Service"
}, {
  id: "transportation",
  label: "Transportation"
}];

const allCareServices = [{
  id: "twenty_four_hour_staff",
  label: "24/7 Staff"
}, {
  id: "medication_management",
  label: "Medication Management"
}, {
  id: "personal_care",
  label: "Personal Care Assistance"
}, {
  id: "mobility_assistance",
  label: "Mobility Assistance"
}, {
  id: "meal_preparation",
  label: "Meal Preparation"
}, {
  id: "memory_care",
  label: "Memory Care"
}, {
  id: "social_activities",
  label: "Social Activities"
}];

const AmenitiesServicesTab = ({
  amenities,
  careServices,
  isOwner = false,
  propertyId = "",
  onUpdate,
  isEditing
}: AmenitiesServicesTabProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(amenities);
  const [selectedServices, setSelectedServices] = useState<string[]>(careServices);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      const amenityLabel = allAmenities.find(a => a.id === amenityId)?.label;
      if (amenityLabel) {
        setSelectedAmenities([...selectedAmenities, amenityLabel]);
      }
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => {
        const matchingAmenity = allAmenities.find(item => item.label === a);
        return matchingAmenity?.id !== amenityId;
      }));
    }
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      const serviceLabel = allCareServices.find(s => s.id === serviceId)?.label;
      if (serviceLabel) {
        setSelectedServices([...selectedServices, serviceLabel]);
      }
    } else {
      setSelectedServices(selectedServices.filter(s => {
        const matchingService = allCareServices.find(item => item.label === s);
        return matchingService?.id !== serviceId;
      }));
    }
  };

  const isAmenitySelected = (amenityId: string) => {
    const amenity = allAmenities.find(a => a.id === amenityId);
    return amenity ? selectedAmenities.includes(amenity.label) : false;
  };

  const isServiceSelected = (serviceId: string) => {
    const service = allCareServices.find(s => s.id === serviceId);
    return service ? selectedServices.includes(service.label) : false;
  };

  const saveAmenities = async () => {
    if (!propertyId) return;
    try {
      // Convert selected amenities to database format
      const amenitiesData: Record<string, boolean> = {};
      allAmenities.forEach(amenity => {
        amenitiesData[amenity.id] = isAmenitySelected(amenity.id);
      });

      // Update amenities in database
      const { error } = await supabase
        .from("care_home_amenities")
        .update(amenitiesData)
        .eq("care_home_id", propertyId);
      
      if (error) throw error;

      // Update UI
      if (onUpdate) {
        onUpdate({
          amenities: selectedAmenities
        });
      }
      
      // Toast notifications have been removed
    } catch (error) {
      console.error("Error saving amenities:", error);
      // Toast notifications have been removed
    }
  };

  const saveServices = async () => {
    if (!propertyId) return;
    try {
      // Convert selected services to database format
      const servicesData: Record<string, boolean> = {};
      allCareServices.forEach(service => {
        servicesData[service.id] = isServiceSelected(service.id);
      });

      // Update services in database
      const { error } = await supabase
        .from("care_home_services")
        .update(servicesData)
        .eq("care_home_id", propertyId);
      
      if (error) throw error;

      // Update UI
      if (onUpdate) {
        onUpdate({
          careServices: selectedServices
        });
      }
      
      // Toast notifications have been removed
    } catch (error) {
      console.error("Error saving care services:", error);
      // Toast notifications have been removed
    }
  };

  // New methods to handle saving both amenities and services at once
  const saveAll = async () => {
    await saveAmenities();
    await saveServices();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Amenities</h2>
            {isOwner && isEditing && (
              <div className="flex gap-2">
                
              </div>
            )}
          </div>
          
          {isEditing && isOwner ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allAmenities.map(amenity => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity.id}`} 
                    checked={isAmenitySelected(amenity.id)} 
                    onCheckedChange={checked => handleAmenityChange(amenity.id, checked === true)} 
                  />
                  <label 
                    htmlFor={`amenity-${amenity.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedAmenities.length === 0 ? (
                <p className="text-gray-600">No amenities listed for this property.</p>
              ) : (
                selectedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-care-600 mr-2"></div>
                    <span>{amenity}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Care Services</h2>
            {isOwner && isEditing && (
              <div className="flex gap-2">
                
              </div>
            )}
          </div>
          
          {isEditing && isOwner ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allCareServices.map(service => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`service-${service.id}`} 
                    checked={isServiceSelected(service.id)} 
                    onCheckedChange={checked => handleServiceChange(service.id, checked === true)} 
                  />
                  <label 
                    htmlFor={`service-${service.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedServices.length === 0 ? (
                <p className="text-gray-600">No care services listed for this property.</p>
              ) : (
                selectedServices.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-care-600 mr-2"></div>
                    <span>{service}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmenitiesServicesTab;
