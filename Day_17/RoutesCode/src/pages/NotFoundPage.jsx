import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-container text-center">
      <h1 className="error-code">404</h1>
      <h2>Page Not Found</h2>
      <p>The requested route does not exist on this server.</p>
      <Link to="/" className="btn-primary">
        Return to Dashboard Home
      </Link>
    </div>
  );
}
