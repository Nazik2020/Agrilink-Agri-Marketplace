// Utilities for handling marketplace vs. dashboard logout behaviors

// Clear ONLY Customer Dashboard UI/cache state. Do NOT clear marketplace auth here.
export function exitCustomerDashboardOnly() {
  const dashboardKeys = [
    'customerDashboardState',
    'customerDashboardFilters',
    'customerDashboardSidebarOpen',
    'customerDashboardLastTab',
  ];
  dashboardKeys.forEach((k) => {
    try {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    } catch {}
  });
}

// Full customer logout (keep for global navbar or explicit full sign-out flows)
export function logoutAllCustomers() {
  try {
    // Clear ALL web storage to avoid leaving behind any auth flags
    localStorage.clear();
    sessionStorage.clear();

    // Aggressively expire common auth/session cookies (including PHP session)
    const cookieNames = ["authToken", "session", "refreshToken", "PHPSESSID"];
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  } catch (e) {
    // ignore
  }
}
