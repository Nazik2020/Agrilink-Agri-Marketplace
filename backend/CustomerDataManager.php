<?php
/**
 * CustomerDataManager Class
 * Handles customer data operations following OOP principles
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
    public function __construct($conn, $customerId) {
        $this->conn = $conn;
        $this->customerId = $customerId;
        $this->customerData = null;
    }

    /**
     * Load customer data from database
     * @return bool Success status
     */
    public function loadCustomerData() {
        try {
            $stmt = $this->conn->prepare("
                SELECT id, full_name, email, address, contactno, country, postal_code, profile_image, created_at, updated_at
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
        return $this->customerId;
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
        return $this->customerData['country'] ?? '';
    }

    /**
     * Get customer postal code
     * @return string Customer postal code or empty string
     */
    public function getCustomerPostalCode() {
        return $this->customerData['postal_code'] ?? '';
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
            'message' => ''
        ];

        $requiredFields = ['full_name', 'email', 'address', 'contactno', 'country', 'postal_code'];
        
        foreach ($requiredFields as $field) {
            if (empty($this->customerData[$field])) {
                $validation['missingFields'][] = $field;
                $validation['isValid'] = false;
            }
        }

        if (!$validation['isValid']) {
            $validation['message'] = 'Customer profile incomplete. Please update your profile first.';
        }

        return $validation;
    }

    /**
     * Get formatted customer data for billing
     * @return array Formatted billing data
     */
    public function getBillingData() {
        if (!$this->isDataLoaded()) {
            return null;
        }
        
        return [
            'billing_name' => $this->customerData['full_name'],
            'billing_email' => $this->customerData['email'],
            'billing_address' => $this->customerData['address'],
            'billing_postal_code' => $this->customerData['postal_code'],
            'billing_country' => $this->customerData['country']
        ];
    }

    /**
     * Static method to create instance from customer ID
     * @param PDO $conn Database connection
     * @param int $customerId Customer ID
     * @return CustomerDataManager|null Instance or null if invalid
     */
    public static function createFromCustomerId($conn, $customerId) {
        if (!$customerId || !is_numeric($customerId)) {
            return null;
        }

        $manager = new self($conn, $customerId);
        if ($manager->loadCustomerData()) {
            return $manager;
        }

        return null;
    }
}
?> 