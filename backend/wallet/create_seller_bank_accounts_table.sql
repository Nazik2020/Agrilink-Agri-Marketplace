                                                                                                CREATE TABLE IF NOT EXISTS seller_bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(50) NOT NULL,
    expiry VARCHAR(10) NOT NULL,
    cvc VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPmarketplace:1  Access to XMLHttpRequest at 'http://localhost/Agrilink-Agri-Marketplace/backend/add_order_simple.php' from origin 'http://localhost:3002' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:3000' that is not equal to the supplied origin.
BuyNowModal.jsx:375  Error sending order to backend: AxiosError
handlePayment @ BuyNowModal.jsx:375
/Agrilink-Agri-Marketplace/backend/add_order_simple.php:1   Failed to load resource: net::ERR_FAILED
BuyNowModal.jsx:124 Loading REAL customer signup data for ID: 4
BuyNowModal.jsx:205 Using mock Stripe key - payment will work
BuyNowModal.jsx:149 Backend response: Object
BuyNowModal.jsx:151 Backend response: Object
BuyNowModal.jsx:174 ✅ Successfully loaded real customer data: Object
BuyNowModal.jsx:311 Payment successful!
BuyNowModal.jsx:357 Order payload sent to backend: Object
marketplace:1  Access to XMLHttpRequest at 'http://localhost/Agrilink-Agri-Marketplace/backend/add_order_simple.php' from origin 'http://localhost:3002' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:3000' that is not equal to the supplied origin.
BuyNowModal.jsx:375  Error sending order to backend: AxiosError
handlePayment @ BuyNowModal.jsx:375
/Agrilink-Agri-Marketplace/backend/add_order_simple.php:1   Failed to load resource: net::ERR_FAILED
);
