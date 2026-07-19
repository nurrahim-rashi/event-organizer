import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutStore {
  selectedEvent: any | null;
  cartItems: { ticket: any; qty: number }[];
  appliedVoucher: any | null;
  appliedCoupon: any | null;
  usePoints: number;
  transaction: any | null;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setCheckoutData: (
    event: any,
    items: { ticket: any; qty: number }[],
    voucher: any | null,
    coupon: any | null,
    usePoints: number,
  ) => void;
  setTransaction: (tx: any) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      selectedEvent: null,
      cartItems: [],
      appliedVoucher: null,
      appliedCoupon: null,
      usePoints: 0,
      transaction: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setCheckoutData: (event, items, voucher, coupon, points) =>
        set({
          selectedEvent: event,
          cartItems: items,
          appliedVoucher: voucher,
          appliedCoupon: coupon,
          usePoints: points, // Sekarang menerima number
        }),

      setTransaction: (tx) => set({ transaction: tx }),

      clearCheckoutData: () =>
        set({
          selectedEvent: null,
          cartItems: [],
          appliedVoucher: null,
          appliedCoupon: null,
          usePoints: 0,
          transaction: null,
        }),
    }),
    {
      name: "checkout-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
