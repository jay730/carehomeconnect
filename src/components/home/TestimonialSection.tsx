
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    quote: "Finding the right care home for my mother was overwhelming until I found Care Home Connect. The detailed listings and reviews helped us make the right choice.",
    author: "Sarah Johnson",
    relation: "Daughter of Resident",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    quote: "As a care home owner, this platform has helped us connect with families looking for quality care. The subscription is worth every penny.",
    author: "Michael Chen",
    relation: "Care Home Owner",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 3,
    quote: "The transparent payment system makes it easy to manage monthly payments to the care home. I appreciate the peace of mind it brings.",
    author: "David Williams",
    relation: "Son of Resident",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from families and care home owners who've experienced the difference Silver Stay makes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <svg className="h-8 w-8 text-care-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-700 flex-1 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.relation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
