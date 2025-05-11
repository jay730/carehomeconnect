import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, CalendarCheck, Home } from 'lucide-react';
import FeaturedListings from '@/components/home/FeaturedListings';
import TestimonialSection from '@/components/home/TestimonialSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';

const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-care-700 to-care-500 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find the Perfect Residential Care Home with Care Home Connect
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting families with licensed residential care homes with verified owners, amenities, transparent pricing, and real reviews.
            </p>
          </div>

          <Card className="bg-white shadow-lg p-3">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col">
                    <label htmlFor="location" className="text-gray-700 font-medium mb-2">Location</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input 
                        id="location"
                        placeholder="City, state, or zip code"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full md:w-auto">
                    Search Care Homes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Listings Section */}
      <FeaturedListings />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialSection />
      
      {/* CTA Section */}
      <section className="bg-care-50 py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find the Perfect Care Home?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of families who have found the licensed care home for their loved ones through Care Home Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/search')} 
              size="lg"
              className="bg-care-600 hover:bg-care-700"
            >
              Start Your Search
            </Button>
            <Button 
              onClick={() => navigate('/register')} 
              variant="outline"
              size="lg"
            >
              Create an Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
