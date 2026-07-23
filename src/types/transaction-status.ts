export type TransactionStatus = "DONE" | "REJECTED" | "WAITING_CONFIRMATION" | "WAITING_PAYMENT";

export interface UpdateStatusPayload {
  transactionId: number;
  status: "DONE" | "REJECTED";
  accessToken: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data: Record<string, any>;
}

export interface TransactionActionProps {
  transactionId: number;
  accessToken: string;
  onSuccess?: () => void;
}