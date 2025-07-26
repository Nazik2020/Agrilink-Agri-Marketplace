<?php
/**
 * Stripe Payment Service - Professional payment processing
 * Handles all Stripe API interactions with OOP principles
 */

require_once __DIR__ . '/../config/stripe.php';

class StripePaymentService {
    private $stripe;
    private $secretKey;
    
    /**
     * Constructor - Initialize Stripe with API key
     */
    public function __construct() {
        $this->secretKey = StripeConfig::getSecretKey();
        
        // Initialize Stripe (Note: You'll need to install Stripe PHP SDK)
        // For now, we'll simulate the Stripe API calls
        $this->initializeStripe();
    }
    
    /**
     * Initialize Stripe SDK
     */
    private function initializeStripe() {
        // TODO: Install Stripe PHP SDK with: composer require stripe/stripe-php
        // \Stripe\Stripe::setApiKey($this->secretKey);
        
        // For demo purposes, we'll create a mock Stripe object
        $this->stripe = new class {
            public function createPaymentIntent($params) {
                // Simulate Stripe PaymentIntent creation
                return (object) [
                    'id' => 'pi_' . uniqid(),
                    'client_secret' => 'pi_' . uniqid() . '_secret_' . uniqid(),
                    'amount' => $params['amount'],
                    'currency' => $params['currency'],
                    'status' => 'requires_payment_method'
                ];
            }
            
            public function confirmPayment($paymentIntentId) {
                // Simulate payment confirmation
                return (object) [
                    'id' => $paymentIntentId,
                    'status' => 'succeeded',
                    'payment_method' => (object) [
                        'card' => (object) [
                            'last4' => '4242',
                            'brand' => 'visa'
                        ]
                    ]
                ];
            }
        };
    }
    
    /**
     * Create payment intent for checkout
     */
    public function createPaymentIntent($amount, $currency = 'usd', $metadata = []) {
        try {
            // Convert amount to cents (Stripe expects smallest currency unit)
            $amountInCents = intval($amount * 100);
            
            $paymentIntentData = [
                'amount' => $amountInCents,
                'currency' => $currency,
                'metadata' => $metadata,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ];
            
            // Create PaymentIntent via Stripe API
            $paymentIntent = $this->stripe->createPaymentIntent($paymentIntentData);
            
            return [
                'success' => true,
                'payment_intent' => [
                    'id' => $paymentIntent->id,
                    'client_secret' => $paymentIntent->client_secret,
                    'amount' => $amount,
                    'currency' => $currency
                ]
            ];
            
        } catch (Exception $e) {
            error_log("Stripe PaymentIntent creation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Payment initialization failed'
            ];
        }
    }
    
    /**
     * Confirm payment and get payment details
     */
    public function confirmPayment($paymentIntentId) {
        try {
            $paymentIntent = $this->stripe->confirmPayment($paymentIntentId);
            
            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'payment' => [
                        'id' => $paymentIntent->id,
                        'status' => $paymentIntent->status,
                        'card_last_four' => $paymentIntent->payment_method->card->last4 ?? null,
                        'card_brand' => $paymentIntent->payment_method->card->brand ?? null
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Payment not completed'
                ];
            }
            
        } catch (Exception $e) {
            error_log("Stripe payment confirmation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Payment confirmation failed'
            ];
        }
    }
    
    /**
     * Validate card details (basic validation)
     */
    public function validateCardDetails($cardData) {
        $errors = [];
        
        // Validate card number (basic check)
        if (empty($cardData['number']) || !$this->isValidCardNumber($cardData['number'])) {
            $errors[] = 'Invalid card number';
        }
        
        // Validate expiry date
        if (empty($cardData['exp_month']) || empty($cardData['exp_year'])) {
            $errors[] = 'Invalid expiry date';
        }
        
        // Validate CVC
        if (empty($cardData['cvc']) || strlen($cardData['cvc']) < 3) {
            $errors[] = 'Invalid CVC';
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Basic card number validation (Luhn algorithm)
     */
    private function isValidCardNumber($cardNumber) {
        $cardNumber = preg_replace('/\s+/', '', $cardNumber);
        
        if (!ctype_digit($cardNumber) || strlen($cardNumber) < 13 || strlen($cardNumber) > 19) {
            return false;
        }
        
        // Luhn algorithm
        $sum = 0;
        $alt = false;
        
        for ($i = strlen($cardNumber) - 1; $i >= 0; $i--) {
            $n = intval($cardNumber[$i]);
            
            if ($alt) {
                $n *= 2;
                if ($n > 9) {
                    $n = ($n % 10) + 1;
                }
            }
            
            $sum += $n;
            $alt = !$alt;
        }
        
        return ($sum % 10) === 0;
    }
    
    /**
     * Get publishable key for frontend
     */
    public function getPublishableKey() {
        return StripeConfig::getPublishableKey();
    }
    
    /**
     * Check if in test mode
     */
    public function isTestMode() {
        return StripeConfig::isTestMode();
    }
}
?>
