
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PropertyNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-12 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">
          The property you're trying to pay for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/search")}>
          Browse Care Homes
        </Button>
      </div>
    </div>
  );
};

export default PropertyNotFound;
