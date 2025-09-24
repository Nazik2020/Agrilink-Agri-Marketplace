import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAllCustomers } from "../utils/authSession";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch("http://localhost/Agrilink-Agri-Marketplace/backend/logout.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
      } catch (_) {
        // ignore network errors; proceed with client logout
      }
      
      // More aggressive logout
      localStorage.clear();
      sessionStorage.clear();
      // Set guard AFTER clearing storage so it persists for this navigation
      try { sessionStorage.setItem('logout_in_progress', String(Date.now())); } catch (_) {}
      try { localStorage.setItem('auth_event', `logout:${Date.now()}`); } catch (_) {}
      try {
        window.dispatchEvent(new CustomEvent('userStateChanged', { detail: { action: 'logout' } }));
      } catch (_) {}
      
      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
      });

      // Force hard redirect (not React navigation)
      window.location.href = '/';
    };
    doLogout();
  }, [navigate]);
  return null;
}
