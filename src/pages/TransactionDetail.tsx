import React from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/transaction.service";
import toast from "react-hot-toast";
import { axiosInstance } from "../api/axios";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { userAuth } from "../stores/useAuth";

export default function TransactionDetail() {
  const { user } = userAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const res = await transactionApi.getById(Number(id));
      return res.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: "DONE" | "REJECTED") =>
      axiosInstance.patch(`/transactions/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction", id] });
      toast.success("Status updated");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed"),
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#171021] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || !transaction)
    return (
      <div className="text-white text-center pt-20">Transaction not found.</div>
    );

  // Logika Authorization
  const isSuperAdmin = user?.role === "SUPERADMIN";
  const isEventOwner = transaction?.event?.organizerId === user?.id;
  const canReview = isSuperAdmin || isEventOwner;

  return (
    <div className="bg-[#171021] text-[#eadef6] min-h-screen pb-16 selection:bg-[#ddb7ff] selection:text-[#490080]">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Breadcrumb
                items={[
                  { label: "Dashboard", path: "/dashboard" },
                  { label: "Transactions", path: "/transactions" },
                  {
                    label: `Transaction #${transaction.id}`,
                    path: `/transactions/${transaction.id}`,
                  },
                ]}
              />{" "}
              <span className="bg-[#e364a7]/20 text-[#ffafd3] px-3 py-1 rounded-full text-xs font-bold tracking-widest">
                TRANSACTION #{transaction.id}
              </span>
              <h1 className="text-4xl font-black mt-2">Purchase Detail</h1>
              <p className="text-[#cfc2d6]">
                Processed on{" "}
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-[#231d2e] p-4 rounded-2xl border border-[#4d4354]/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffafd3]/10 flex items-center justify-center text-[#ffafd3]">
                <span className="material-symbols-outlined">pending</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#cfc2d6]">
                  Status
                </p>
                <p className="font-bold text-[#5de6ff]">{transaction.status}</p>
              </div>
            </div>
          </div>

          {/* Action Bar (Bento Style) */}
          {transaction.status === "WAITING_CONFIRMATION" && canReview && (
            <div className="bg-[#231d2e] border border-[#4d4354] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ddb7ff]/10 flex items-center justify-center text-[#ddb7ff]">
                  <span className="material-symbols-outlined">image</span>
                </div>
                <div>
                  <h4 className="font-bold">Review Payment Proof</h4>
                  <p className="text-sm text-[#cfc2d6]">
                    Verify the user's bank transfer receipt.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => statusMutation.mutate("DONE")}
                  className="px-6 py-3 bg-[#5de6ff] text-[#00363e] rounded-xl font-bold hover:opacity-90"
                >
                  Approve
                </button>
                <button
                  onClick={() => statusMutation.mutate("REJECTED")}
                  className="px-6 py-3 bg-[#93000a] text-white rounded-xl font-bold hover:opacity-90"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Summary */}
            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden bg-[#231d2e]/50 border border-[#4d4354]">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={transaction.event?.bannerImage}
                  className="w-full h-full object-cover"
                  alt="Event"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171021] to-transparent" />
                <h2 className="absolute bottom-4 left-6 text-2xl font-bold">
                  {transaction.event?.name}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#cfc2d6] uppercase font-bold">
                    Venue
                  </p>
                  <p className="font-medium">{transaction.event?.location}</p>
                </div>
                <div>
                  <p className="text-xs text-[#cfc2d6] uppercase font-bold">
                    Date
                  </p>
                  <p className="font-medium">
                    {new Date(
                      transaction.event?.startDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Payment Summary */}
            <div className="glass-card rounded-2xl p-6 bg-[#231d2e]/50 border border-[#4d4354] space-y-4">
              <h3 className="font-bold border-b border-[#4d4354] pb-3">
                Order Breakdown
              </h3>

              {/* List Items */}
              {transaction.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.ticketType.name} x {item.qty}
                  </span>
                  <span className="font-bold">
                    Rp{(item.price * item.qty).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              {/* Discount Sections (BARU) */}
              <div className="space-y-2 pt-2 border-t border-[#4d4354]">
                {transaction.voucher && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Voucher ({transaction.voucher.code})</span>
                    <span>
                      -Rp{transaction.voucher.discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {transaction.coupon && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Coupon Discount</span>
                    <span>
                      -Rp{transaction.coupon.discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {transaction.pointUsed > 0 && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Points Used</span>
                    <span>
                      -Rp{transaction.pointUsed.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-[#4d4354] flex justify-between text-lg font-bold">
                <span>Total Payment</span>
                <span className="text-[#ddb7ff]">
                  Rp{transaction.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>{" "}
          </div>
        </div>
      </main>{" "}
    </div>
  );
}
