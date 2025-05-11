
import { Card, CardContent } from "@/components/ui/card";
import ReviewReply from "./ReviewReply";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  reply?: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  isOwner?: boolean;
  propertyOwnerId?: string;
}

const ReviewsTab = ({ reviews, isOwner = false, propertyOwnerId = '' }: ReviewsTabProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">
          Reviews ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-600">This property has no reviews yet.</p>
        ) : (
          <div className="space-y-8">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{review.author}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
                
                {isOwner && (
                  <ReviewReply 
                    reviewId={review.id}
                    propertyOwnerId={propertyOwnerId}
                    existingReply={review.reply}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsTab;
