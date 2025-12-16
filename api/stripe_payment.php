<?php
// Stripe Payment Integration
require_once 'database.php';
require_once 'auth.php';
require_once 'env_loader.php';

class StripePayment {
    private $db;
    private $stripeSecretKey;
    private $stripePublishableKey;
    private $webhookSecret;
    
    public function __construct() {
        $this->db = Database::getInstance();
        // Use environment variables with fallback to placeholders
        $this->stripeSecretKey = env('STRIPE_SECRET_KEY', 'sk_test_your_stripe_secret_key');
        $this->stripePublishableKey = env('STRIPE_PUBLIC_KEY', 'pk_test_your_stripe_publishable_key');
        $this->webhookSecret = env('STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret');
    }
    
    // Create Stripe customer
    public function createCustomer($email, $name, $schoolId) {
        try {
            $stripe = new \Stripe\StripeClient($this->stripeSecretKey);
            
            $customer = $stripe->customers->create([
                'email' => $email,
                'name' => $name,
                'metadata' => [
                    'school_id' => $schoolId
                ]
            ]);
            
            return ['success' => true, 'customer_id' => $customer->id];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Create subscription
    public function createSubscription($customerId, $priceId, $schoolId) {
        try {
            $stripe = new \Stripe\StripeClient($this->stripeSecretKey);
            
            $subscription = $stripe->subscriptions->create([
                'customer' => $customerId,
                'items' => [
                    ['price' => $priceId]
                ],
                'payment_behavior' => 'default_incomplete',
                'payment_settings' => ['save_default_payment_method' => 'on_subscription'],
                'expand' => ['latest_invoice.payment_intent'],
                'metadata' => [
                    'school_id' => $schoolId
                ]
            ]);
            
            // Update database
            $this->db->query(
                "UPDATE subscriptions SET stripe_subscription_id = ?, stripe_customer_id = ?, status = 'active' WHERE school_id = ?",
                [$subscription->id, $customerId, $schoolId]
            );
            
            return [
                'success' => true,
                'subscription_id' => $subscription->id,
                'client_secret' => $subscription->latest_invoice->payment_intent->client_secret
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get subscription status
    public function getSubscriptionStatus($schoolId) {
        $subscription = $this->db->fetch(
            "SELECT * FROM subscriptions WHERE school_id = ?",
            [$schoolId]
        );
        
        if (!$subscription) {
            return ['success' => false, 'error' => 'No subscription found'];
        }
        
        return [
            'success' => true,
            'subscription' => $subscription
        ];
    }
    
    // Cancel subscription
    public function cancelSubscription($schoolId) {
        try {
            $subscription = $this->db->fetch(
                "SELECT stripe_subscription_id FROM subscriptions WHERE school_id = ?",
                [$schoolId]
            );
            
            if (!$subscription || !$subscription['stripe_subscription_id']) {
                return ['success' => false, 'error' => 'No active subscription found'];
            }
            
            $stripe = new \Stripe\StripeClient($this->stripeSecretKey);
            
            $stripe->subscriptions->cancel($subscription['stripe_subscription_id']);
            
            // Update database
            $this->db->query(
                "UPDATE subscriptions SET status = 'cancelled' WHERE school_id = ?",
                [$schoolId]
            );
            
            return ['success' => true];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Handle webhook events
    public function handleWebhook($payload, $signature) {
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                $this->webhookSecret
            );
            
            switch ($event->type) {
                case 'invoice.payment_succeeded':
                    $this->handlePaymentSucceeded($event->data->object);
                    break;
                    
                case 'invoice.payment_failed':
                    $this->handlePaymentFailed($event->data->object);
                    break;
                    
                case 'customer.subscription.deleted':
                    $this->handleSubscriptionDeleted($event->data->object);
                    break;
                    
                case 'customer.subscription.updated':
                    $this->handleSubscriptionUpdated($event->data->object);
                    break;
            }
            
            return ['success' => true];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function handlePaymentSucceeded($invoice) {
        $subscriptionId = $invoice->subscription;
        
        $this->db->query(
            "UPDATE subscriptions SET status = 'active', current_period_start = FROM_UNIXTIME(?), current_period_end = FROM_UNIXTIME(?) WHERE stripe_subscription_id = ?",
            [
                $invoice->period_start,
                $invoice->period_end,
                $subscriptionId
            ]
        );
    }
    
    private function handlePaymentFailed($invoice) {
        $subscriptionId = $invoice->subscription;
        
        $this->db->query(
            "UPDATE subscriptions SET status = 'past_due' WHERE stripe_subscription_id = ?",
            [$subscriptionId]
        );
    }
    
    private function handleSubscriptionDeleted($subscription) {
        $this->db->query(
            "UPDATE subscriptions SET status = 'cancelled' WHERE stripe_subscription_id = ?",
            [$subscription->id]
        );
    }
    
    private function handleSubscriptionUpdated($subscription) {
        $this->db->query(
            "UPDATE subscriptions SET status = ?, current_period_start = FROM_UNIXTIME(?), current_period_end = FROM_UNIXTIME(?) WHERE stripe_subscription_id = ?",
            [
                $subscription->status,
                $subscription->current_period_start,
                $subscription->current_period_end,
                $subscription->id
            ]
        );
    }
    
    // Get pricing plans
    public function getPricingPlans() {
        return [
            'basic' => [
                'name' => 'Basic',
                'price' => '₱888.00',
                'stripe_price_id' => 'price_basic_monthly', // Replace with actual Stripe price ID
                'features' => [
                    'School landing page',
                    '1000 users',
                    'Basic support',
                    'Email notifications',
                    'Mobile responsive'
                ]
            ],
            'pro' => [
                'name' => 'Pro',
                'price' => '₱1,888.00',
                'stripe_price_id' => 'price_pro_monthly', // Replace with actual Stripe price ID
                'features' => [
                    'Unlimited posts',
                    'RSVP events',
                    'Priority support',
                    'Marketplace',
                    'Custom branding',
                    'Advanced reporting'
                ]
            ],
            'premium' => [
                'name' => 'Premium',
                'price' => '₱3,888.00',
                'stripe_price_id' => 'price_premium_monthly', // Replace with actual Stripe price ID
                'features' => [
                    'White‑label UI',
                    'Verified marketplace',
                    'API access',
                    'Advanced analytics',
                    'Custom integrations',
                    'Priority feature requests'
                ]
            ]
        ];
    }
}
?>
