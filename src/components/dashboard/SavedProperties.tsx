
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface SavedProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
}

interface SavedPropertiesProps {
  properties: SavedProperty[];
  onRemoveProperty: (id: string) => void;
}

const SavedProperties = ({ properties, onRemoveProperty }: SavedPropertiesProps) => {
  const navigate = useNavigate();

  const handleRemoveProperty = (id: string) => {
    onRemoveProperty(id);
    // Toast notifications have been removed
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/40 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">No Saved Properties</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Save properties you're interested in to compare and visit later.
        </p>
        <Button onClick={() => navigate("/search")}>
          Browse Care Homes
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <Card key={property.id} className="care-card">
          <div className="h-40 w-full relative">
            <img 
              src={property.image} 
              alt={property.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{property.name}</CardTitle>
            <CardDescription>{property.location}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="font-semibold text-lg">
              ${property.price}/month
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4">
            <Button 
              className="w-full"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              View Details
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleRemoveProperty(property.id)}
            >
              Remove from Saved
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SavedProperties;
