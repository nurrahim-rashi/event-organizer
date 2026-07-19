import { useEffect, useState } from "react";
import { transactionApi } from "../services/transaction.service";
import type { Transaction } from "../types/type";
import Navbar from "../components/General/Navbar";
import Breadcrumb from "../components/General/Breadcrumb";
import { useNavigate } from "react-router";
import { getStatusStyle } from "../utils/style";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionApi.getAll();
      const data = response.data.data || response.data;
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleCardClick = (tx: Transaction) => {
    if (tx.status === "WAITING_PAYMENT") {
      navigate(`/transactions/checkout`);
    } else {
      navigate(`/transactions/${tx.id}`);
    }
  };

  const activeTransactions = transactions.filter(
    (t) =>
      t.status === "WAITING_CONFIRMATION" || t.status === "WAITING_PAYMENT",
  );
  const historyTransactions = transactions.filter(
    (t) =>
      t.status !== "WAITING_PAYMENT" && t.status !== "WAITING_CONFIRMATION",
  );

  const TransactionCard = ({ tx }: { tx: Transaction }) => (
    <div
      onClick={() => handleCardClick(tx)}
      className="glass-card p-5 rounded-xl flex items-center justify-between hover:bg-surface-container-high transition-all cursor-pointer group border border-white/5 hover:border-primary/30"
    >
      <div className="flex flex-col gap-1">
        <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
          {tx.event?.name}
        </span>
        <div className="items-center gap-3 text-xs text-on-surface-variant">
          <span>
            Transaction created at {new Date(tx.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-bold text-on-surface">
            Rp{tx.totalPrice.toLocaleString("id-ID")}
          </p>
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase">
            {tx.items?.reduce((acc, item) => acc + item.qty, 0)} Tickets
          </p>{" "}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-12 ${getStatusStyle(tx.status)}`}
          >
            {tx.status.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="mt-16 p-8 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar bg-background text-on-background">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Transactions", path: "/transactions" },
            ]}
          />

          {loading ? (
            <p className="text-center text-on-surface-variant">Loading...</p>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Active Section */}
              {activeTransactions.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                    Active Transactions
                  </h3>
                  <div className="flex flex-col gap-4">
                    {activeTransactions.map((tx) => (
                      <TransactionCard key={tx.id} tx={tx} />
                    ))}
                  </div>
                </section>
              )}

              {/* History Section */}
              <section>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                  Past Records
                </h3>
                <div className="flex flex-col gap-4">
                  {historyTransactions.map((tx) => (
                    <TransactionCard key={tx.id} tx={tx} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>{" "}
    </>
  );
};

export default TransactionPage;
