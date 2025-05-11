import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PropertyMediaUpload } from "@/components/PropertyMediaUpload";
import { supabase } from "@/integrations/supabase/client";

const ListProperty = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    capacity: "",
    price: "",
  });

  // Amenities state
  const [amenities, setAmenities] = useState({
    privateRooms: false,
    ensuiteRooms: false,
    garden: false,
    communalDining: false,
    entertainmentArea: false,
    housekeeping: false,
    laundry: false,
    transportation: false,
  });

  // Care services state
  const [careServices, setCareServices] = useState({
    twentyFourHourStaff: false,
    medicationManagement: false,
    personalCare: false,
    mobilityAssistance: false,
    mealPreparation: false,
    memoryCare: false,
    socialActivities: false,
  });

  const [mediaUrls, setMediaUrls] = useState<{ photos: string[], video: string | null }>({
    photos: [],
    video: null
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity: keyof typeof amenities, checked: boolean) => {
    setAmenities(prev => ({ ...prev, [amenity]: checked }));
  };

  // Handle care service checkbox changes
  const handleCareServiceChange = (service: keyof typeof careServices, checked: boolean) => {
    setCareServices(prev => ({ ...prev, [service]: checked }));
  };

  // Validation helper functions
  const hasAtLeastOneAmenity = () => {
    return Object.values(amenities).some(value => value === true);
  };

  const hasAtLeastOneCareService = () => {
    return Object.values(careServices).some(value => value === true);
  };

  const hasAtLeastOnePhoto = () => {
    return mediaUrls.photos.length > 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ["name", "address", "city", "state", "zipCode", "description", "capacity", "price"];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`Please provide the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }

      // Validate at least one amenity is selected
      if (!hasAtLeastOneAmenity()) {
        throw new Error("Please select at least one amenity");
      }

      // Validate at least one care service is selected
      if (!hasAtLeastOneCareService()) {
        throw new Error("Please select at least one care service");
      }

      // Validate at least one photo is uploaded
      if (!hasAtLeastOnePhoto()) {
        throw new Error("Please upload at least one photo of your care home");
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Insert into Supabase care_homes table
      const { data: careHome, error: careHomeError } = await supabase
        .from('care_homes')
        .insert([
          {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            description: formData.description,
            capacity: parseInt(formData.capacity),
            price: parseFloat(formData.price),
            owner_id: user.id
          }
        ])
        .select();

      if (careHomeError) throw careHomeError;
      
      if (!careHome || careHome.length === 0) {
        throw new Error("Failed to create property record");
      }

      const careHomeId = careHome[0].id;

      // Insert amenities
      const { error: amenitiesError } = await supabase
        .from('care_home_amenities')
        .insert([{
          care_home_id: careHomeId,
          private_rooms: amenities.privateRooms,
          ensuite_rooms: amenities.ensuiteRooms,
          garden: amenities.garden,
          communal_dining: amenities.communalDining,
          entertainment_area: amenities.entertainmentArea,
          housekeeping: amenities.housekeeping,
          laundry: amenities.laundry,
          transportation: amenities.transportation
        }]);

      if (amenitiesError) throw amenitiesError;

      // Insert services
      const { error: servicesError } = await supabase
        .from('care_home_services')
        .insert([{
          care_home_id: careHomeId,
          twenty_four_hour_staff: careServices.twentyFourHourStaff,
          medication_management: careServices.medicationManagement,
          personal_care: careServices.personalCare,
          mobility_assistance: careServices.mobilityAssistance,
          meal_preparation: careServices.mealPreparation,
          memory_care: careServices.memoryCare,
          social_activities: careServices.socialActivities
        }]);

      if (servicesError) throw servicesError;

      // Insert media
      const mediaEntries = mediaUrls.photos.map((photo, index) => ({
        care_home_id: careHomeId,
        photo_url: photo,
        is_primary: index === 0 // First photo is primary
      }));

      // Add video as a separate entry if available
      if (mediaUrls.video) {
        mediaEntries.push({
          care_home_id: careHomeId,
          photo_url: mediaUrls.video,
          is_primary: false
        });
      }

      const { error: mediaError } = await supabase
        .from('care_home_media')
        .insert(mediaEntries);

      if (mediaError) throw mediaError;
      
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error submitting property:", error);
      setError(error instanceof Error ? error.message : "An error occurred while listing your property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List Your Care Home</h1>
        <p className="text-gray-600">
          Provide details about your care home to connect with families looking for quality care.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your care home.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Care Home Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Sunshine Senior Care"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="e.g., 123 Care Street"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., San Francisco"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="e.g., CA"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="e.g., 94123"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your care home, its environment, and what makes it special..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Resident Capacity *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 8"
                  value={formData.capacity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="e.g., 2800"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Select the amenities available at your care home. At least one amenity is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privateRooms" 
                  checked={amenities.privateRooms}
                  onCheckedChange={(checked) => handleAmenityChange("privateRooms", !!checked)}
                />
                <Label htmlFor="privateRooms">Private Rooms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ensuiteRooms" 
                  checked={amenities.ensuiteRooms}
                  onCheckedChange={(checked) => handleAmenityChange("ensuiteRooms", !!checked)}
                />
                <Label htmlFor="ensuiteRooms">Ensuite Bathrooms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="garden" 
                  checked={amenities.garden}
                  onCheckedChange={(checked) => handleAmenityChange("garden", !!checked)}
                />
                <Label htmlFor="garden">Beautiful Garden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="communalDining" 
                  checked={amenities.communalDining}
                  onCheckedChange={(checked) => handleAmenityChange("communalDining", !!checked)}
                />
                <Label htmlFor="communalDining">Communal Dining</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="entertainmentArea" 
                  checked={amenities.entertainmentArea}
                  onCheckedChange={(checked) => handleAmenityChange("entertainmentArea", !!checked)}
                />
                <Label htmlFor="entertainmentArea">Entertainment Area</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="housekeeping" 
                  checked={amenities.housekeeping}
                  onCheckedChange={(checked) => handleAmenityChange("housekeeping", !!checked)}
                />
                <Label htmlFor="housekeeping">Housekeeping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="laundry" 
                  checked={amenities.laundry}
                  onCheckedChange={(checked) => handleAmenityChange("laundry", !!checked)}
                />
                <Label htmlFor="laundry">Laundry Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="transportation" 
                  checked={amenities.transportation}
                  onCheckedChange={(checked) => handleAmenityChange("transportation", !!checked)}
                />
                <Label htmlFor="transportation">Transportation</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Care Services</CardTitle>
            <CardDescription>
              Select the care services you provide to residents. At least one service is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="twentyFourHourStaff" 
                  checked={careServices.twentyFourHourStaff}
                  onCheckedChange={(checked) => handleCareServiceChange("twentyFourHourStaff", !!checked)}
                />
                <Label htmlFor="twentyFourHourStaff">24/7 Staff</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medicationManagement" 
                  checked={careServices.medicationManagement}
                  onCheckedChange={(checked) => handleCareServiceChange("medicationManagement", !!checked)}
                />
                <Label htmlFor="medicationManagement">Medication Management</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="personalCare" 
                  checked={careServices.personalCare}
                  onCheckedChange={(checked) => handleCareServiceChange("personalCare", !!checked)}
                />
                <Label htmlFor="personalCare">Personal Care Assistance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mobilityAssistance" 
                  checked={careServices.mobilityAssistance}
                  onCheckedChange={(checked) => handleCareServiceChange("mobilityAssistance", !!checked)}
                />
                <Label htmlFor="mobilityAssistance">Mobility Assistance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mealPreparation" 
                  checked={careServices.mealPreparation}
                  onCheckedChange={(checked) => handleCareServiceChange("mealPreparation", !!checked)}
                />
                <Label htmlFor="mealPreparation">Meal Preparation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="memoryCare" 
                  checked={careServices.memoryCare}
                  onCheckedChange={(checked) => handleCareServiceChange("memoryCare", !!checked)}
                />
                <Label htmlFor="memoryCare">Memory Care</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="socialActivities" 
                  checked={careServices.socialActivities}
                  onCheckedChange={(checked) => handleCareServiceChange("socialActivities", !!checked)}
                />
                <Label htmlFor="socialActivities">Social Activities</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Property Media</CardTitle>
            <CardDescription>
              Add photos and a video of your care home to help families get a better view. At least one photo is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyMediaUpload
              onUploadComplete={setMediaUrls}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/owner/dashboard")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "List Property"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ListProperty;
