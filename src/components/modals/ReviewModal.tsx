import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  menuItemName?: string;
  menuItemId?: string;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  restaurantId,
  restaurantName,
  menuItemName,
  menuItemId,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [rating, setRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      error('Please write a brief comment sharing your experience.');
      return;
    }

    StorageService.addReview({
      userId: user?.id || 'user-customer-1',
      userName: user?.name || 'Happy Customer',
      userAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      restaurantId,
      restaurantName,
      menuItemId,
      menuItemName,
      orderId,
      rating,
      foodRating,
      deliveryRating,
      comment: comment.trim(),
    });

    success('Thank you! Your review has been published.');
    if (onReviewSubmitted) onReviewSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Rate & Review</h3>
            <p className="text-xs text-stone-500 font-medium">
              Share your feedback for <strong className="text-orange-600">{restaurantName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            aria-label="Close review dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Overall Rating */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Overall Experience
            </span>
            <div className="flex justify-center">
              <RatingStars rating={rating} size="lg" interactive onRate={setRating} />
            </div>
            <p className="text-xs font-bold text-amber-800">
              {rating === 5 ? 'Exceptional! 🌟' : rating === 4 ? 'Very Good! 👍' : rating === 3 ? 'Average' : 'Could Be Better'}
            </p>
          </div>

          {/* Sub Ratings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1 text-center">
              <span className="text-xs font-bold text-stone-700">Food Taste & Quality</span>
              <div className="flex justify-center">
                <RatingStars rating={foodRating} size="sm" interactive onRate={setFoodRating} />
              </div>
            </div>
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1 text-center">
              <span className="text-xs font-bold text-stone-700">Delivery Speed & Packing</span>
              <div className="flex justify-center">
                <RatingStars rating={deliveryRating} size="sm" interactive onRate={setDeliveryRating} />
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-xs font-bold uppercase text-stone-700 mb-1.5">
              Your Review
            </label>
            <textarea
              id="review-comment"
              rows={4}
              placeholder="What did you like about the food, flavors, or delivery speed?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};
