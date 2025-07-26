<?php
/**
 * Stripe Configuration for Agrilink
 * Professional payment processing setup
 */

class StripeConfig {
    // Test API Keys (from your Stripe dashboard)
    const TEST_PUBLISHABLE_KEY = 'pk_test_51Romdj4cTGhWoRPf6G9UwQPNBz9OjvpI9ST91MJt4LW20gzANyx27z0e7wOMKx5OJwgWixnHFiCWEx5Jip7Y95hy007K0RuxLO';
    const TEST_SECRET_KEY = 'sk_test_51Romdj4cTGhWoRPfD3pSu8ilqvUM0ZMuTHnA9wPpTOTiusqhYQc3dA2ckCqiP6nErtmCj4deln3OQSoCr1C0jImj00oEyRxfeX';
    
    // Live API Keys (for production - leave empty for now)
    const LIVE_PUBLISHABLE_KEY = '';
    const LIVE_SECRET_KEY = '';
    
    // Configuration
    const CURRENCY = 'usd';
    const WEBHOOK_SECRET = ''; // Will set this up later
    
    // Environment setting
    const IS_LIVE = false; // Set to true when ready for production
    
    /**
     * Get the current publishable key based on environment
     */
    public static function getPublishableKey() {
        return self::IS_LIVE ? self::LIVE_PUBLISHABLE_KEY : self::TEST_PUBLISHABLE_KEY;
    }
    
    /**
     * Get the current secret key based on environment
     */
    public static function getSecretKey() {
        return self::IS_LIVE ? self::LIVE_SECRET_KEY : self::TEST_SECRET_KEY;
    }
    
    /**
     * Check if we're in test mode
     */
    public static function isTestMode() {
        return !self::IS_LIVE;
    }
}
?>
