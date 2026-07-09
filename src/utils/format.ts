export const getEventDateParts = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
};

export const formatPrice = (tickets: any[]) => {
  if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
    return "Check Details";
  }

  const prices = tickets.map((t) => Number(t.price)).filter((p) => !isNaN(p));

  if (prices.length === 0) return "Check Details";

  const minPrice = Math.min(...prices);

  return minPrice === 0
    ? "Free"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(minPrice);
};
