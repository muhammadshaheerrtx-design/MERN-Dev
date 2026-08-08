import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-container text-center centered-404">
      <h1 className="code-404">404</h1>
      <h2>Security Boundary Exceeded</h2>
      <p>The requested route does not exist within the application router.</p>
      <Link to="/" className="btn-primary">
        Return to Safety (Dashboard)
      </Link>
    </div>
  );
}
