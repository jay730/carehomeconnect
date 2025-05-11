
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  location: string;
  image: string;
  startDate: string;
  monthlyPayment: number;
  nextPaymentDate: string;
  resident: string;
}

interface CurrentBookingsProps {
  bookings: Booking[];
}

const CurrentBookings = ({ bookings }: CurrentBookingsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleMakePayment = (propertyId: string) => {
    navigate(`/payment/${propertyId}`);
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/40 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">No Active Bookings</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Find and book a care home for your loved one to get started.
        </p>
        <Button onClick={() => navigate("/search")}>
          Find Care Homes
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookings.map(booking => (
        <Card key={booking.id} className="overflow-hidden care-card">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img 
                src={booking.image} 
                alt={booking.propertyName} 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3">
              <CardHeader>
                <CardTitle>{booking.propertyName}</CardTitle>
                <CardDescription>{booking.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resident:</span>
                    <span className="font-medium">{booking.resident}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">${booking.monthlyPayment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Payment:</span>
                    <span className="font-medium">{new Date(booking.nextPaymentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  className="w-full"
                  onClick={() => handleMakePayment(booking.propertyId)}
                  disabled={bookings.length === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/property/${booking.propertyId}`)}
                >
                  View Property
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CurrentBookings;
