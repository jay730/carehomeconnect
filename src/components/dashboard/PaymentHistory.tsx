
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Payment {
  id: string;
  amount: number;
  date: string;
  property: string;
  status: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  // Check if there are no payments
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/40 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">No Payment History</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Your payment history will appear here once you make payments for care home bookings.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          View your payment history for all care home bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {payments.map(payment => (
            <div key={payment.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-medium text-lg">${payment.amount}</p>
                <p className="text-gray-600 text-sm">
                  {payment.property}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
              <Badge 
                variant={payment.status === "successful" ? "default" : "destructive"}
                className="capitalize"
              >
                {payment.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Payments
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentHistory;
