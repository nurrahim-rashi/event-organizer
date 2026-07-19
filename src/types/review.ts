export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profilePic?: string | null;
  };
  transaction: {
    event: {
      name: string;
    };
  };
}
