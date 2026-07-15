import { Link } from "react-router";

function BackLink() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">
        ← Back to stories
      </Link>
    </p>
  );
}

export default BackLink;