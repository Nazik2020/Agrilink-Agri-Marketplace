<?php
/**
 * CustomerDataManager Class
 * Handles customer data operations
 */
class CustomerDataManager {
    private $conn;
    private $customerId;
    private $customerData;

    /**
     * Constructor
     * @param PDO $conn Database connection
     * @param int $customerId Customer ID
     */
    public function __construct($conn, $customerData) {
        $this->conn = $conn;
        $this->customerData = $customerData;
        $this->customerId = $customerData['id'] ?? null;
    }

    /**
     * Load customer data from database
     * @return bool Success status
     */
    public function loadCustomerData() {
        try {
            $stmt = $this->conn->prepare("
                SELECT id, full_name, email, address, contactno, country, postal_code, profile_image
                FROM customers 
                WHERE id = ?
            ");
            
            $stmt->execute([$this->customerId]);
            $this->customerData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $this->customerData !== false;
        } catch (PDOException $e) {
            error_log("Error loading customer data: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get customer data
     * @return array|null Customer data or null if not loaded
     */
    public function getCustomerData() {
        return $this->customerData;
    }

    /**
     * Get customer ID
     * @return int Customer ID
     */
    public function getCustomerId() {
        return $this->customerData['id'] ?? null;
    }

    /**
     * Get customer name
     * @return string Customer name or empty string
     */
    public function getCustomerName() {
        return $this->customerData['full_name'] ?? '';
    }

    /**
     * Get customer email
     * @return string Customer email or empty string
     */
    public function getCustomerEmail() {
        return $this->customerData['email'] ?? '';
    }

    /**
     * Get customer address
     * @return string Customer address or empty string
     */
    public function getCustomerAddress() {
        return $this->customerData['address'] ?? '';
    }

    /**
     * Get customer contact number
     * @return string Customer contact number or empty string
     */
    public function getCustomerContact() {
        return $this->customerData['contactno'] ?? '';
    }

    /**
     * Get customer country
     * @return string Customer country or empty string
     */
    public function getCustomerCountry() {
        return $this->customerData['country'] ?? 'Sri Lanka';
    }

    /**
     * Get customer postal code
     * @return string Customer postal code or empty string
     */
    public function getCustomerPostalCode() {
        return $this->customerData['postal_code'] ?? '20000';
    }

    /**
     * Check if customer data is loaded
     * @return bool True if data is loaded
     */
    public function isDataLoaded() {
        return $this->customerData !== null;
    }

    /**
     * Validate customer data completeness
     * @return array Validation results
     */
    public function validateCustomerData() {
        $validation = [
            'isValid' => true,
            'missingFields' => [],
            'message' => '',
            'hasMinimalData' => false,
            'hasCompleteProfile' => false
        ];

        // Check if we have minimal data (from signup)
        $hasMinimal = !empty($this->customerData['full_name']) && !empty($this->customerData['email']);
        $validation['hasMinimalData'] = $hasMinimal;

        if (!$hasMinimal) {
            $validation['isValid'] = false;
            $validation['message'] = 'Customer account data is incomplete. Please contact support.';
            return $validation;
        }

        // Check if customer has completed their profile (billing info)
        $hasCompleteProfile = !empty($this->customerData['address']) && 
                             !empty($this->customerData['contactno']) && 
                             !empty($this->customerData['country']) && 
                             !empty($this->customerData['postal_code']);
        
        $validation['hasCompleteProfile'] = $hasCompleteProfile;

        if ($hasCompleteProfile) {
            $validation['isValid'] = true;
            $validation['message'] = 'Profile complete. Billing information will be auto-filled.';
        } else {
            // Identify missing profile fields
            $missingFields = [];
            if (empty($this->customerData['address'])) $missingFields[] = 'address';
            if (empty($this->customerData['contactno'])) $missingFields[] = 'contact number';
            if (empty($this->customerData['country'])) $missingFields[] = 'country';
            if (empty($this->customerData['postal_code'])) $missingFields[] = 'postal code';
            
            $validation['missingFields'] = $missingFields;
            $validation['isValid'] = true; // Still allow checkout
            $validation['message'] = 'Please complete your profile for auto-filled billing. Missing: ' . implode(', ', $missingFields);
        }

        return $validation;
    }

    /**
     * Get formatted customer data for billing
     * @return array Formatted billing data with completeness info
     */
    public function getBillingData() {
        if (!$this->isDataLoaded()) {
            return null;
        }
        
        $billingData = [
            'billing_name' => $this->customerData['full_name'] ?? '',
            'billing_email' => $this->customerData['email'] ?? '',
            'billing_address' => $this->customerData['address'] ?? '',
            'billing_postal_code' => $this->customerData['postal_code'] ?? '',
            'billing_country' => $this->customerData['country'] ?? ''
        ];

        // Check profile completeness
        $validation = $this->validateCustomerData();
        
        return [
            'billingData' => $billingData,
            'hasCompleteProfile' => $validation['hasCompleteProfile'],
            'missingFields' => $validation['missingFields'] ?? [],
            'message' => $validation['message']
        ];
    }

    /**
     * Static method to create instance from customer ID
     * @param PDO $conn Database connection
     * @param int $customerId Customer ID
     * @return CustomerDataManager|null Instance or null if invalid
     */
    public static function createFromCustomerId($conn, $customerId) {
        try {
            $query = "SELECT * FROM customers WHERE id = :customer_id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':customer_id', $customerId);
            $stmt->execute();
            
            $customerData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($customerData) {
                return new self($conn, $customerData);
            }
            
            return null;
        } catch (Exception $e) {
            error_log("Error in CustomerDataManager::createFromCustomerId: " . $e->getMessage());
            return null;
        }
    }
}
?>