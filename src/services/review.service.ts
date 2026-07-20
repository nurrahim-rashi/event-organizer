import { axiosInstance } from "../api/axios";
import type { ReviewSchema } from "../schemas/event/review";

export const submitReview = async (data: ReviewSchema) => {
  const res = await axiosInstance.post("/reviews", data);
  return res.data;
};
