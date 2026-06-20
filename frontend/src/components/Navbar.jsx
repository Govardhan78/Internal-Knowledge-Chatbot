import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-15 bg-surface border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <span className="font-bold text-[17px] text-heading">KnowledgeBot</span>
      </div>

      <div className="flex items-center gap-5">
        {user?.role === "admin" && (
          <Link to="/admin" className="text-sm font-medium text-muted hover:text-heading transition-colors">
            Admin
          </Link>
        )}
        <Link to="/chat" className="text-sm font-medium text-muted hover:text-heading transition-colors">
          Chat
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[rgba(108,99,255,0.15)] border border-accent text-accent">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-text">{user?.name}</span>
          {user?.role === "admin" && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(108,99,255,0.15)] text-accent border border-[rgba(108,99,255,0.3)] font-semibold tracking-wide">
              Admin
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-sm px-4 py-1.5 rounded-lg border border-border text-muted hover:text-heading hover:border-muted transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
