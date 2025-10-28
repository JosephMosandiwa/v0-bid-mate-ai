-- Add payment_gateway column to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(20) DEFAULT 'stripe';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_gateway 
ON subscriptions(payment_gateway);

-- Update existing records to use stripe
UPDATE subscriptions 
SET payment_gateway = 'stripe' 
WHERE payment_gateway IS NULL;
