import { useState } from "react";

export default function PaymentProofModal({
  totalPrice = 0,
  onClose,
  onSubmit,
}: any) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 bg-[#110b1b]/80 backdrop-blur-md flex items-center justify-center p-6 z-[60]">
      <div className="bg-[#1f1929] border border-[#393244] w-full max-w-lg rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#eadef6] mb-2">
          Upload Payment Proof
        </h2>
        <p className="text-[#cfc2d6] mb-6">
          Total: Rp{Number(totalPrice).toLocaleString("id-ID")}{" "}
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-[#cfc2d6] mb-6"
        />

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#4d4354] rounded-lg text-[#eadef6]"
          >
            Cancel
          </button>
          <button
            onClick={() => file && onSubmit(file)}
            disabled={!file}
            className="flex-1 bg-[#ddb7ff] text-[#490080] font-bold py-3 rounded-lg"
          >
            Submit
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
