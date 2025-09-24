/**
 * Authentication Service - Handles persistent login and session management
 */

class AuthService {
  constructor() {
    this.isCheckingAuth = false;
    this.authChecked = false;
    this._storageSyncInitialized = false;
    this._initStorageSync();
  }

  /**
   * Check if user is logged in via session or remember token
   * This should be called on every page load
   */
  async checkAuthStatus() {
    // Guard: if a recent logout just happened, skip auto-login to avoid flicker
    try {
      const logoutFlag = sessionStorage.getItem('logout_in_progress');
      if (logoutFlag) {
        const ts = parseInt(logoutFlag, 10);
        const ageMs = Date.now() - (Number.isFinite(ts) ? ts : 0);
        if (!Number.isNaN(ageMs) && ageMs < 5000) {
          // Within 5s of logout → ensure frontend cleared
          this.handleLogout();
          // Do not mark authChecked so checkAuthStatus can run later if needed
          this.authChecked = false;
          return false;
        }
        // Too old → clear flag
        sessionStorage.removeItem('logout_in_progress');
      }
    } catch (_) {}

    if (this.isCheckingAuth || this.authChecked) {
      return;
    }

    this.isCheckingAuth = true;

    try {
      const response = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/check_session.php', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success && data.logged_in) {
        // User is logged in, update frontend state
        this.handleSuccessfulAuth(data.user, data.auto_logged_in);
        return true;
      } else {
        // User is not logged in, clear any stale data
        this.handleLogout();
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.handleLogout();
      return false;
    } finally {
      this.isCheckingAuth = false;
      this.authChecked = true;
    }
  }

  /**
   * Handle successful authentication
   */
  handleSuccessfulAuth(userData, isAutoLogin = false) {
    // Normalize payload so all consumers get consistent fields
    const normalized = { ...userData };
    // For customers, prefer full_name
    if (normalized.role === 'customer') {
      normalized.full_name = normalized.full_name || normalized.name || normalized.username || '';
    }
    // Ensure profile_image exists for all roles
    normalized.profile_image = normalized.profile_image || normalized.business_logo || null;

    // Store normalized user in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(normalized));

    // For seller dashboards that expect a separate 'seller' object with business_logo
    if (normalized.role === 'seller') {
      const sellerObj = {
        id: normalized.id,
        email: normalized.email || '',
        username: normalized.username || normalized.business_name || normalized.name || 'Seller',
        business_name: normalized.business_name || normalized.name || 'Seller',
        business_description: normalized.business_description || '',
        business_logo: normalized.business_logo || normalized.profile_image || null,
        country: normalized.country || '',
        contact_number: normalized.contact_number || '',
        address: normalized.address || ''
      };
      sessionStorage.setItem('seller', JSON.stringify(sellerObj));
      if (normalized.id) {
        localStorage.setItem('seller_id', normalized.id);
      }
    }

    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent('userStateChanged', {
        detail: { 
          action: isAutoLogin ? 'auto_login' : 'login', 
          user: userData 
        }
      })
    );

    // Broadcast to other tabs
    try { localStorage.setItem('auth_event', `login:${Date.now()}`); } catch (_) {}

    console.log(isAutoLogin ? 'Auto-login successful' : 'Login successful:', userData);
  }

  /**
   * Handle logout
   */
  handleLogout() {
    // Broadcast to other tabs first
    try { localStorage.setItem('auth_event', `logout:${Date.now()}`); } catch (_) {}

    // Clear local state
    this._clearFrontendAuth();
  }

  _clearFrontendAuth() {
    try { sessionStorage.removeItem('user'); } catch (_) {}
    try { sessionStorage.removeItem('seller'); } catch (_) {}
    try { localStorage.removeItem('seller_id'); } catch (_) {}

    window.dispatchEvent(
      new CustomEvent('userStateChanged', {
        detail: { action: 'logout' }
      })
    );
  }

  /**
   * Perform logout
   */
  async logout() {
    try {
      await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear frontend state
      try { sessionStorage.setItem('logout_in_progress', String(Date.now())); } catch (_) {}
      this.handleLogout();
      // After clearing client state, force recheck to avoid auto-login from stale caches
      try { this.resetAuthCheck(); } catch (_) {}
      try { await this.checkAuthStatus(); } catch (_) {}
    }
  }

  /**
   * Get current user from session storage
   */
  getCurrentUser() {
    try {
      const userString = sessionStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Check if user is logged in (frontend only)
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Reset auth check flag (for testing or manual refresh)
   */
  resetAuthCheck() {
    this.authChecked = false;
    this.isCheckingAuth = false;
  }

  _initStorageSync() {
    if (this._storageSyncInitialized) return;
    this._storageSyncInitialized = true;
    try {
      window.addEventListener('storage', (e) => {
        if (!e) return;
        if (e.key === 'auth_event' && typeof e.newValue === 'string') {
          if (e.newValue.startsWith('logout:')) {
            // Another tab logged out → clear this tab too
            this._clearFrontendAuth();
          } else if (e.newValue.startsWith('login:')) {
            // Another tab logged in → re-check auth to sync this tab
            this.resetAuthCheck();
            this.checkAuthStatus();
          }
        }
      });
    } catch (_) {}
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

export function logout() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("customer");
    localStorage.removeItem("seller");
    sessionStorage.clear();
    // Clear any auth cookies if used
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (e) {
    // ignore
  }
}

export function isLoggedIn() {
  try {
    const token = localStorage.getItem("token");
    const customer = localStorage.getItem("customer");
    return !!token || !!customer;
  } catch (_) {
    return false;
  }
}
