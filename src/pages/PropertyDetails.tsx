
import { useParams } from "react-router-dom";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";

// Import extracted components
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyImage from "@/components/property/PropertyImage";
import PropertyTabs from "@/components/property/PropertyTabs";
import OwnerActions from "@/components/property/OwnerActions";
import PropertyLoading from "@/components/property/PropertyLoading";
import PropertyNotFound from "@/components/property/PropertyNotFound";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    property,
    loading,
    error,
    isOwner,
    isEditing,
    isAuthenticated,
    setIsEditing,
    handlePropertyDeactivated,
    handlePropertyUpdated,
    handleImageUpdated,
    handleMediaUpdated,
    handleAmenitiesServicesUpdated,
    user
  } = usePropertyDetails(id);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <PropertyLoading />;
  }

  if (error) {
    console.error("Property loading error:", error);
    // Use fallback demo property when there's a connection error
    return renderFallbackProperty();
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="container py-8 px-4">
      {/* Property Header */}
      <PropertyHeader
        id={property.id}
        name={property.name}
        location={property.location}
        active={property.active}
        reviews={property.reviews}
        capacity={property.capacity}
        userRole={user?.user_metadata?.role}
        price={property.price}
        image={property.image}
      />

      {/* Property Image */}
      <div className="mb-4">
        <PropertyImage 
          image={property.image} 
          name={property.name}
          isOwner={isOwner}
          propertyId={property.id}
          onImageUpdated={handleImageUpdated}
          isEditing={isEditing}
        />
      </div>
      
      {/* Property Tabs and Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <PropertyTabs
          property={property}
          isOwner={isOwner}
          isEditing={isEditing}
          isAuthenticated={isAuthenticated}
          onEdit={handleEditClick}
          onSave={handleSaveClick}
          onCancel={handleCancelClick}
          onPropertyUpdated={handlePropertyUpdated}
          onMediaUpdated={handleMediaUpdated}
          onAmenitiesServicesUpdated={handleAmenitiesServicesUpdated}
          setIsEditing={setIsEditing}
          userRole={user?.user_metadata?.role}
          user={user}
        />
      </div>

      {/* Owner Actions */}
      {isOwner && (
        <OwnerActions
          propertyId={property.id}
          propertyName={property.name}
          active={property.active}
          onDeactivate={handlePropertyDeactivated}
        />
      )}
    </div>
  );
};

// Fallback property data to use when there's a connection error
function renderFallbackProperty() {
  const demoProperty = {
    id: "demo-property",
    name: "Sunset Senior Care Home",
    description: "A beautiful care home with a focus on comfort and well-being. This demonstration property showcases our platform features while we address connectivity issues.",
    location: "123 Main Street, San Francisco, CA 94105",
    price: 3500,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    amenities: ["Private Rooms", "Beautiful Garden", "Communal Dining", "Entertainment Area"],
    capacity: 24,
    careServices: ["24/7 Staff", "Medication Management", "Personal Care Assistance", "Social Activities"],
    active: true,
    owner: {
      name: "Demo Owner",
      phone: "(555) 123-4567",
      email: "demo@carehomeconnect.com"
    },
    reviews: [
      {
        id: "r1-demo",
        author: "Sarah Johnson",
        date: "2023-02-15",
        rating: 5,
        comment: "This is a demonstration review. When connectivity is restored, you'll see real reviews here."
      }
    ],
    ownerId: "demo-owner",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip_code: "94105"
  };

  return (
    <div className="container py-8 px-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>Connection issue:</strong> Using demo data while we try to connect to the server. Some features may be limited.
        </p>
      </div>
      
      {/* Property Header */}
      <PropertyHeader
        id={demoProperty.id}
        name={demoProperty.name}
        location={demoProperty.location}
        active={demoProperty.active}
        reviews={demoProperty.reviews}
        capacity={demoProperty.capacity}
        price={demoProperty.price}
        image={demoProperty.image}
      />

      {/* Property Image */}
      <div className="mb-4">
        <PropertyImage 
          image={demoProperty.image} 
          name={demoProperty.name}
          isOwner={false}
          propertyId={demoProperty.id}
          isEditing={false}
        />
      </div>
      
      {/* Property Tabs */}
      <div className="flex items-center justify-between mb-6">
        <PropertyTabs
          property={demoProperty}
          isOwner={false}
          isEditing={false}
          isAuthenticated={true}
          onEdit={() => {}}
          onSave={() => {}}
          onCancel={() => {}}
          onPropertyUpdated={() => {}}
          onMediaUpdated={() => {}}
          onAmenitiesServicesUpdated={() => {}}
          setIsEditing={() => {}}
        />
      </div>
    </div>
  );
}

export default PropertyDetails;
