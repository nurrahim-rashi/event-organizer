import { Link } from "react-router";

interface BreadcrumbProps {
  items: {
    label: string;
    path?: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav
      className="flex items-center gap-2 text-sm text-[#988d9f] mb-6 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#ddb7ff] transition-colors shrink-0"
      >
        EventSync
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const formattedLabel =
          index === 1 ? toTitleCase(item.label) : item.label;

        return (
          <div key={index} className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[16px] text-[#4d4354] select-none">
              chevron_right
            </span>
            {isLast || !item.path ? (
              <span className="text-[#eadef6] font-medium max-w-[200px] truncate">
                {formattedLabel}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-[#ddb7ff] transition-colors"
              >
                {formattedLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
