import { useState } from "react";
import { toast } from "react-hot-toast";
import { submitReview } from "../../services/review.service";

interface ReviewModalProps {
  transactionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal = ({
  transactionId,
  isOpen,
  onClose,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitReview({ transactionId, rating, comment });
      toast.success("Review submitted!");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#231d2e] border border-[#393244] rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-[#393244] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#eadef6]">
            Rate Your Experience
          </h2>
          <button onClick={onClose} className="text-[#cfc2d6] hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <span
                  className={`material-symbols-outlined text-4xl ${star <= rating ? "text-[#ddb7ff] font-variation-fill" : "text-[#4d4354]"}`}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          <textarea
            className="w-full bg-[#110b1b] border border-[#393244] rounded-lg p-4 text-white outline-none focus:border-[#ddb7ff]"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="px-8 py-6 bg-[#1f1929] flex justify-end gap-4">
          <button onClick={onClose} className="text-[#cfc2d6]">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-[#ddb7ff] text-[#400071] rounded-lg font-bold"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};
