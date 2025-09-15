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
        
        // Enhanced mock Stripe object with proper card validation
        $this->stripe = new class {
            // Stripe test card numbers
            private $validTestCards = [
                '4242424242424242' => ['brand' => 'visa', 'last4' => '4242', 'status' => 'succeeded'],
                '5555555555554444' => ['brand' => 'mastercard', 'last4' => '4444', 'status' => 'succeeded'],
                '378282246310005'  => ['brand' => 'amex', 'last4' => '0005', 'status' => 'succeeded'],
            ];
            
            private $declineTestCards = [
                '4000000000000002' => ['brand' => 'visa', 'last4' => '0002', 'error' => 'generic_decline'],
                '4000000000009995' => ['brand' => 'visa', 'last4' => '9995', 'error' => 'insufficient_funds'],
                '4000000000009987' => ['brand' => 'visa', 'last4' => '9987', 'error' => 'lost_card'],
            ];
            
            private $currentCardNumber = null;
            
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
            
            public function confirmPayment($paymentIntentId, $cardNumber = null) {
                // Store card number for validation
                if ($cardNumber) {
                    $this->currentCardNumber = $cardNumber;
                }
                
                // If no card number provided, default to success (for existing flow)
                if (!$this->currentCardNumber) {
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
                
                // Clean card number (remove spaces)
                $cleanCardNumber = str_replace(' ', '', $this->currentCardNumber);
                
                // Check if it's a valid success card
                if (isset($this->validTestCards[$cleanCardNumber])) {
                    $cardInfo = $this->validTestCards[$cleanCardNumber];
                    return (object) [
                        'id' => $paymentIntentId,
                        'status' => 'succeeded',
                        'payment_method' => (object) [
                            'card' => (object) [
                                'last4' => $cardInfo['last4'],
                                'brand' => $cardInfo['brand']
                            ]
                        ]
                    ];
                }
                
                // Check if it's a decline card
                if (isset($this->declineTestCards[$cleanCardNumber])) {
                    $cardInfo = $this->declineTestCards[$cleanCardNumber];
                    throw new Exception("Payment failed: " . $cardInfo['error']);
                }
                
                // Invalid card number (not a recognized Stripe test card)
                throw new Exception("Payment failed: invalid_card_number");
            }
            
            public function setCardNumber($cardNumber) {
                $this->currentCardNumber = $cardNumber;
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
     * Set card number for payment validation
     */
    public function setCardNumber($cardNumber) {
        $this->stripe->setCardNumber($cardNumber);
    }
    
    /**
     * Confirm payment and get payment details
     */
    public function confirmPayment($paymentIntentId, $cardNumber = null) {
        try {
            // Set card number if provided
            if ($cardNumber) {
                $this->setCardNumber($cardNumber);
            }
            
            $paymentIntent = $this->stripe->confirmPayment($paymentIntentId, $cardNumber);
            
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
            
            // Return specific error messages for different decline reasons
            $errorMessage = $e->getMessage();
            if (strpos($errorMessage, 'generic_decline') !== false) {
                return [
                    'success' => false,
                    'error' => 'Your card was declined. Please try a different payment method.'
                ];
            } elseif (strpos($errorMessage, 'insufficient_funds') !== false) {
                return [
                    'success' => false,
                    'error' => 'Your card has insufficient funds. Please try a different card.'
                ];
            } elseif (strpos($errorMessage, 'lost_card') !== false) {
                return [
                    'success' => false,
                    'error' => 'Your card has been reported as lost or stolen.'
                ];
            } elseif (strpos($errorMessage, 'invalid_card_number') !== false) {
                return [
                    'success' => false,
                    'error' => 'Invalid card number. Please use a valid test card number.'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Payment confirmation failed'
                ];
            }
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
