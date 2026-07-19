import type { User } from "./user";
import type { Review } from "./review";

export interface Organizer {
  organizer: User;
  bio?: string;
  eventsCount: number;
  followersCount: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    stars: number;
    percentage: number;
  }[];
  reviews: Review[];
  organizedEvents: Event[];
}
