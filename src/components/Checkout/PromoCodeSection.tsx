import React, { useState } from "react";

export default function PromoCodeSection() {
  const [code, setCode] = useState("");

  return (
    <section className="flex flex-col gap-4">
      <label className="text-xs font-semibold text-[#cfc2d6] tracking-wider">
        HAVE A PROMO CODE?
      </label>
      <div className="flex gap-3">
        <input
          className="flex-1 bg-[#1f1929] border border-[#4d4354] rounded-lg px-4 py-3 text-[#eadef6] focus:outline-none focus:border-[#ddb7ff] focus:ring-1 focus:ring-[#ddb7ff] transition-all text-sm"
          placeholder="Enter code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="px-6 py-3 bg-[#2e2738] text-[#ddb7ff] font-semibold rounded-lg hover:bg-[#393244] transition-all border border-[#4d4354] text-sm">
          Apply
        </button>
      </div>
    </section>
  );
}
