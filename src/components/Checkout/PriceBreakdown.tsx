export default function PriceBreakdown() {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-xl font-semibold text-[#eadef6] border-b border-[#4d4354] pb-4">
        Ticket Details
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-[#eadef6]">
              General Admission
            </span>
            <span className="text-sm text-[#cfc2d6]">
              Tier 2 Entry • Standard Seating
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#cfc2d6]">x1</span>
            <span className="text-lg font-semibold text-[#eadef6]">
              $149.00
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-[#cfc2d6]">Service Fee</span>
          <span className="text-sm text-[#cfc2d6]">$12.50</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-[#cfc2d6]">Facility Charge</span>
          <span className="text-sm text-[#cfc2d6]">$5.00</span>
        </div>
      </div>
    </section>
  );
}
