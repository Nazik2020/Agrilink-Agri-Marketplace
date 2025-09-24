# Customer Management & Integration — OOP + Testing Cheat‑Sheet

Use this as talking points during the panel. All paths are relative to the repo root.

## Scope (My Part)

- Backend customer domain and endpoints:
  - `backend/Customer.php`
  - `backend/CustomerDataManager.php`
  - `backend/get_customer_profile.php`
  - `backend/update_customer_profile.php`
  - Auth touchpoints: `backend/Login.php`
- Frontend integration points:
  - Auth/session: `src/services/AuthService.js`
  - Customer flows in UI: `src/pages/CustomerDashboard.jsx`, `src/components/common/Navbar.jsx`
  - Product context using customer identity: `src/pages/ProductDetails.jsx`, wishlist in `src/components/wishlist/WishlistContext.jsx`

## OOP Used (What + Where)

- Encapsulation (data hiding)
  - `Customer` holds a private DB handle and exposes intent methods only:
    ```php
    // backend/Customer.php
    class Customer {
      private $conn; // hidden
      public function __construct($conn) { $this->conn = $conn; }
      public function getByEmail($email) { /* ... */ }
      public function updateProfile(/* fields */) { /* ... */ }
    }
    ```
- Abstraction (business-focused API)
  - `CustomerDataManager` abstracts DB details and exposes domain use-cases:
    - `loadCustomerData()`, getters like `getCustomerName()`
    - `validateCustomerData()` returns profile completeness + missing fields
    - `getBillingData()` prepares normalized data for checkout
- Composition (has‑a)
  - Both classes receive a `PDO` connection, not create it — easy to replace/mock in tests.
- Static factory
  - `CustomerDataManager::createFromCustomerId($conn, $id)` builds a ready instance from an ID.
- Single Responsibility Principle (SRP)
  - `Customer` = persistence operations (read/update)
  - `CustomerDataManager` = formatting, validation, domain rules
- Exceptions as OOP (polymorphic error handling)
  - Try/catch around `PDOException` and `Exception` with consistent JSON error payloads.

## Key Design Choices (Logic)

- Profile update does not allow changing email (acts as stable identity).
- `validateCustomerData()` allows checkout with minimal data but surfaces missing billing fields.
- Secure auth: `Login.php` uses `password_verify` and persistent login via HMAC‑hashed remember token (HTTP‑only cookie).
- Prepared statements everywhere to prevent SQL injection.

## Request Flows (End‑to‑End)

- Fetch profile
  1. UI calls `GET /backend/get_customer_profile.php` (JSON body with `email`).
  2. Script builds `Customer` and runs `getByEmail()` → returns profile JSON.
- Update profile (+ optional image)
  1. UI sends JSON or `multipart/form-data` to `/backend/update_customer_profile.php`.
  2. Script validates inputs, safely stores image, calls `Customer->updateProfile()`.
- Auth (for context)
  1. UI posts to `/backend/Login.php`.
  2. On success, server sets session and optional remember cookie.
  3. UI normalizes user object in `AuthService.js`.

## Likely Panel Q&A (Short Answers)

- Q: Which OOP concepts did you use and why?
  - Encapsulation to protect DB handle; abstraction to expose meaningful customer operations; composition to inject dependencies; SRP to separate persistence vs. domain logic; a static factory for convenient creation.
- Q: Why split `Customer` and `CustomerDataManager`?
  - Keeps persistence concerns isolated; `CustomerDataManager` focuses on validation/formatting for checkout and profile completeness — easier to test and extend independently.
- Q: How would you add a new field (e.g., `city`)?
  - Add DB column; extend `Customer->updateProfile(...)`; update `CustomerDataManager` getters and validation; adjust UI form and payload. Minimal ripple because of SRP.
- Q: How do you prevent SQL injection?
  - All DB operations use prepared statements with bound parameters; no string concatenation.
- Q: What’s your testing strategy?
  - API smoke tests (PowerShell/REST client), input validation tests (invalid email/postal/phone), and auth path tests. Because of constructor injection, DB can be mocked in unit tests (e.g., with PDO stubs) if we add PHPUnit.
- Q: Why allow checkout with incomplete profile but show missing fields?
  - Improves conversion; `validateCustomerData()` communicates what’s missing while not blocking the path. Business choice reflected in code.

## Quick Smoke Tests (PowerShell)

Run from repo root. Make sure XAMPP Apache + MySQL are running and tables exist.

- Get profile

```powershell
$body = @{ email = "alice@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost/Agrilink-Agri-Marketplace/backend/get_customer_profile.php" -Method Post -ContentType "application/json" -Body $body | Select-Object -ExpandProperty Content
```

- Update profile (JSON)

```powershell
$body = @{
  originalEmail = "alice@example.com"
  email         = "alice@example.com"  # email not changed server-side
  fullName      = "Alice Customer"
  address       = "123 Farm Rd"
  contactNumber = "0771234567"
  country       = "Sri Lanka"
  postalCode    = "20000"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost/Agrilink-Agri-Marketplace/backend/update_customer_profile.php" -Method Post -ContentType "application/json" -Body $body | Select-Object -ExpandProperty Content
```

- Update profile with image (multipart)

```powershell
$Form = @{
  originalEmail = "alice@example.com"
  email         = "alice@example.com"
  fullName      = "Alice Customer"
  address       = "123 Farm Rd"
  contactNumber = "0771234567"
  country       = "Sri Lanka"
  postalCode    = "20000"
  profile_image = Get-Item .\sample-profile.jpg  # attaches as file
}
Invoke-WebRequest -Uri "http://localhost/Agrilink-Agri-Marketplace/backend/update_customer_profile.php" -Method Post -Form $Form
```

- Login (for context)

```powershell
$body = @{ email = "alice@example.com"; password = "<password>"; rememberMe = $true } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost/Agrilink-Agri-Marketplace/backend/Login.php" -Method Post -ContentType "application/json" -Body $body -SessionVariable sess | Select-Object -ExpandProperty Content
```

## What To Highlight Live

- Show `validateCustomerData()` returning both `hasCompleteProfile` and a `missingFields` list.
- Explain image upload safety: allowed MIME types, unique filenames, controlled folder, and the response returning the relative path.
- Mention remember‑me token hashing and HTTP‑only cookie.

## Extension Ideas (If asked)

- Extract an interface for repositories (e.g., `CustomerRepositoryInterface`) to swap persistence layers.
- Add PHPUnit tests around `CustomerDataManager` (validation and billing shaping) using a mock/stub PDO.
- Move CORS and error format to a dedicated middleware class for consistency.
