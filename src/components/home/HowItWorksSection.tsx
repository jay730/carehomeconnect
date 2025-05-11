
import React from 'react';
import { Search, Home, CreditCard } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: <Search className="h-10 w-10 text-care-600" />,
    title: "Search Care Homes",
    description: "Enter your location and filter by amenities, price, and care services to find the perfect match for your loved one's needs."
  },
  {
    id: 2,
    icon: <Home className="h-10 w-10 text-care-600" />,
    title: "Visit and Choose",
    description: "Schedule visits to your top choices, meet the staff, and get a feel for the environment before making a decision."
  },
  {
    id: 3,
    icon: <CreditCard className="h-10 w-10 text-care-600" />,
    title: "Simple Payments",
    description: "Set up convenient monthly payments directly to the care home owner through our secure payment system."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes finding and managing senior care homes simple for families and owners alike.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map(step => (
            <div key={step.id} className="text-center">
              <div className="inline-flex items-center justify-center bg-care-50 rounded-full p-4 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
