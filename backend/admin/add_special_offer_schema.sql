-- One-time schema patch for Special Offers support and cart performance
-- Paste this whole script into MySQL Workbench and execute.

DELIMITER $$
CREATE PROCEDURE apply_special_offer_patch()
BEGIN
	DECLARE col_exists INT DEFAULT 0;
	DECLARE col2_exists INT DEFAULT 0;
	DECLARE idx_count INT DEFAULT 0;
	DECLARE uk_count INT DEFAULT 0;

	-- Ensure products.special_offer exists (use 255 to match production dumps)
	SELECT COUNT(1) INTO col_exists
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'products'
		AND COLUMN_NAME = 'special_offer';
	IF col_exists = 0 THEN
		ALTER TABLE products ADD COLUMN special_offer VARCHAR(255) NULL AFTER stock;
	END IF;

	-- Ensure customized_products.special_offer exists
	SELECT COUNT(1) INTO col2_exists
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'customized_products'
		AND COLUMN_NAME = 'special_offer';
	IF col2_exists = 0 THEN
		ALTER TABLE customized_products ADD COLUMN special_offer VARCHAR(255) NULL AFTER category;
	END IF;

	-- Optional: cart_items.price column is usually present; uncomment if missing in your env
	-- ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0;

	-- Optional but recommended: indexes to speed up cart operations
	SELECT COUNT(1) INTO idx_count
	FROM INFORMATION_SCHEMA.STATISTICS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'cart_items'
		AND INDEX_NAME = 'idx_cart_items_cart_id';
	IF idx_count = 0 THEN
		ALTER TABLE cart_items ADD INDEX idx_cart_items_cart_id (cart_id);
	END IF;

	SELECT COUNT(1) INTO idx_count
	FROM INFORMATION_SCHEMA.STATISTICS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'cart_items'
		AND INDEX_NAME = 'idx_cart_items_product_id';
	IF idx_count = 0 THEN
		ALTER TABLE cart_items ADD INDEX idx_cart_items_product_id (product_id);
	END IF;

	-- Optional: enforce a single cart per customer (only if no duplicates)
	SELECT COUNT(1) INTO uk_count
	FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
	WHERE TABLE_SCHEMA = DATABASE()
		AND TABLE_NAME = 'cart'
		AND CONSTRAINT_NAME = 'uniq_cart_customer';
	IF uk_count = 0 THEN
		IF NOT EXISTS (SELECT customer_id FROM cart GROUP BY customer_id HAVING COUNT(*) > 1) THEN
			ALTER TABLE cart ADD CONSTRAINT uniq_cart_customer UNIQUE (customer_id);
		END IF;
	END IF;
END $$
DELIMITER ;

-- Run once
CALL apply_special_offer_patch();
DROP PROCEDURE apply_special_offer_patch;

-- Optional data cleanup: normalize sentinel values to NULL
-- UPDATE products SET special_offer = NULL WHERE special_offer = 'No Special Offer';
-- UPDATE customized_products SET special_offer = NULL WHERE special_offer = 'No Special Offer';
