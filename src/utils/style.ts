export const getStatusStyle = (status: string) => {
  switch (status) {
    case "DONE":
      return "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/20";
    case "WAITING_PAYMENT":
      return "bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/20";
    case "WAITING_CONFIRMATION":
      return "bg-[#ddb7ff]/10 text-[#ddb7ff] border-[#ddb7ff]/20";
    case "CANCELLED":
      return "bg-[#4d4354]/50 text-[#eadef6] border-[#4d4354]";
    case "EXPIRED":
      return "bg-[#4d4354]/25 text-[#eadef6] border-[#4d4354]";
    case "REJECTED":
      return "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20";
    default:
      return "bg-[#4d4354]/20 text-white border-[#4d4354]";
  }
};
