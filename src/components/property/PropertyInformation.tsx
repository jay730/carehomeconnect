
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PropertyInformationProps {
  description: string;
  price: number;
  capacity: number;
  active: boolean;
  isAuthenticated: boolean;
}

const PropertyInformation = ({
  description,
  price,
  capacity,
  active,
  isAuthenticated
}: PropertyInformationProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Property Information</h2>
        </div>
        <p className="text-gray-700 mb-6">
          {description}
        </p>
        
        <h3 className="text-lg font-semibold mb-3">Care Home Details</h3>
        <ul className="space-y-2 mb-6">
          <li className="flex justify-between">
            <span className="text-gray-600">Monthly Price:</span>
            {isAuthenticated ? (
              <span className="font-medium">Starting at ${price.toLocaleString()}/month</span>
            ) : (
              <span className="flex items-center text-amber-600 font-medium">
                <Lock className="h-4 w-4 mr-1" /> 
                <span>Login to view price</span>
              </span>
            )}
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-medium">{capacity} residents</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">Senior Group Home</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${active ? 'text-green-600' : 'text-red-600'}`}>
              {active ? 'Active' : 'Inactive'}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PropertyInformation;
