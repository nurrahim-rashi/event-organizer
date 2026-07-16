import { PenLine } from "lucide-react";
import { Link } from "react-router";

function AuthBrand() {
  return (
    <Link to="/" className="flex items-center justify-center gap-2 mb-8">
      <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
        <PenLine className="h-4 w-4 text-primary-foreground" />
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight">
        MyEvent
      </span>
    </Link>
  );
}

export default AuthBrand;