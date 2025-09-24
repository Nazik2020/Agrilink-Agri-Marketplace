<?php
require_once __DIR__ . '/services/OfferPricing.php';

class Cart {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Get or create cart for a customer
     */
    public function getOrCreateCart($customerId) {
        try {
            // First try to get existing cart
            $stmt = $this->conn->prepare("SELECT cart_id FROM cart WHERE customer_id = ?");
            $stmt->execute([$customerId]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($cart) {
                return $cart['cart_id'];
            }

            // Create new cart if doesn't exist
            $stmt = $this->conn->prepare("INSERT INTO cart (customer_id) VALUES (?)");
            $stmt->execute([$customerId]);
            return $this->conn->lastInsertId();

        } catch (PDOException $e) {
            error_log("Error in getOrCreateCart: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add item to cart
     */
    public function addToCart($customerId, $productId, $quantity = 1, $price = null) {
        try {
            error_log("=== CART::addToCart DEBUG ===");
            error_log("Customer ID: " . $customerId);
            error_log("Product ID: " . $productId);
            error_log("Quantity: " . $quantity);
            error_log("Price: " . $price);
            
            // Get or create cart
            $cartId = $this->getOrCreateCart($customerId);
            if (!$cartId) {
                error_log("Failed to create cart");
                return ["success" => false, "message" => "Failed to create cart"];
            }
            
            error_log("Cart ID: " . $cartId);

            // Always fetch product info to apply offers for regular products
            $basePrice = null;
            $specialOffer = null;
            $isCustomized = false;

            // Check if it's a customized product first (no special offers apply)
            $stmt = $this->conn->prepare("SELECT price, seller_id FROM customized_products WHERE id = ?");
            $stmt->execute([$productId]);
            $customizedProduct = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($customizedProduct) {
                $isCustomized = true;
                $basePrice = (float)$customizedProduct['price'];
                // Verify seller is not banned
                $s = $this->conn->prepare("SELECT status FROM sellers WHERE id = ? LIMIT 1");
                $s->execute([$customizedProduct['seller_id']]);
                $sellerRow = $s->fetch(PDO::FETCH_ASSOC);
                if ($sellerRow && isset($sellerRow['status']) && $sellerRow['status'] === 'banned') {
                    return [
                        "success" => false,
                        "message" => "This seller is currently disabled. For further information, contact the seller."
                    ];
                }
            } else {
                // Regular product: get price and special_offer
                $stmt = $this->conn->prepare("SELECT price, special_offer, seller_id FROM products WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$product) {
                    error_log("Product not found with ID: " . $productId);
                    return ["success" => false, "message" => "Product not found"];
                }
                $basePrice = (float)$product['price'];
                $specialOffer = $product['special_offer'] ?? null;
                // Verify seller is not banned
                $s = $this->conn->prepare("SELECT status FROM sellers WHERE id = ? LIMIT 1");
                $s->execute([$product['seller_id']]);
                $sellerRow = $s->fetch(PDO::FETCH_ASSOC);
                if ($sellerRow && isset($sellerRow['status']) && $sellerRow['status'] === 'banned') {
                    return [
                        "success" => false,
                        "message" => "This seller is currently disabled. For further information, contact the seller."
                    ];
                }
            }

            // Auto-adjust quantity for certain offers (e.g., B1G1 when adding 1)
            if (!$isCustomized) {
                $quantity = OfferPricing::autoAdjustQuantity((int)$quantity, $specialOffer);
            }

            // Determine effective unit price considering the offer
            if ($price === null) {
                if ($isCustomized) {
                    $price = $basePrice;
                } else {
                    $pricing = OfferPricing::compute($basePrice, (int)$quantity, $specialOffer);
                    $price = $pricing['unit_price'];
                }
            }

            // Check if item already exists in cart
            $stmt = $this->conn->prepare("SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?");
            $stmt->execute([$cartId, $productId]);
            $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("Existing item check: " . print_r($existingItem, true));

            if ($existingItem) {
                // Update quantity and recalculate effective price
                $newQuantity = $existingItem['quantity'] + $quantity;
                error_log("Updating existing item quantity to: " . $newQuantity);

                $newPrice = $price;
                if (!$isCustomized) {
                    $pricing = OfferPricing::compute($basePrice, (int)$newQuantity, $specialOffer);
                    $newPrice = $pricing['unit_price'];
                }

                $stmt = $this->conn->prepare("UPDATE cart_items SET quantity = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = ?");
                $stmt->execute([$newQuantity, $newPrice, $existingItem['cart_item_id']]);

                return [
                    "success" => true, 
                    "message" => "Item quantity updated in cart",
                    "cart_item_id" => $existingItem['cart_item_id'],
                    "quantity" => $newQuantity
                ];
            } else {
                // Add new item
                error_log("Adding new item to cart");
                $stmt = $this->conn->prepare("INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
                $stmt->execute([$cartId, $productId, $quantity, $price]);
                
                $newCartItemId = $this->conn->lastInsertId();
                error_log("New cart item ID: " . $newCartItemId);
                
                return [
                    "success" => true, 
                    "message" => "Item added to cart",
                    "cart_item_id" => $newCartItemId,
                    "quantity" => $quantity
                ];
            }

        } catch (PDOException $e) {
            error_log("Error in addToCart: " . $e->getMessage());
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }

    /**
     * Get cart items for a customer
     */
    public function getCartItems($customerId) {
        try {
            // Get regular products
            $stmt = $this->conn->prepare("
                SELECT 
                    ci.cart_item_id,
                    ci.product_id,
                    ci.quantity,
                    ci.price,
                    ci.added_at,
                    p.product_name,
                    p.product_description,
                    p.product_images,
                    p.category,
                    p.seller_id as seller_id,
                    p.price as base_price,
                    p.special_offer,
                    s.business_name as seller_name,
                    'regular' as product_type
                FROM cart c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN products p ON ci.product_id = p.id
                LEFT JOIN sellers s ON p.seller_id = s.id
                WHERE c.customer_id = ?
                ORDER BY ci.added_at DESC
            ");
            $stmt->execute([$customerId]);
            $regularProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get customized products
            $stmt = $this->conn->prepare("
                SELECT 
                    ci.cart_item_id,
                    ci.product_id,
                    ci.quantity,
                    ci.price,
                    ci.added_at,
                    cp.product_name,
                    cp.product_description,
                    cp.product_images,
                    cp.category,
                    cp.seller_id as seller_id,
                    s.business_name as seller_name,
                    'customized' as product_type,
                    cp.customization_description
                FROM cart c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN customized_products cp ON ci.product_id = cp.id
                LEFT JOIN sellers s ON cp.seller_id = s.id
                WHERE c.customer_id = ?
                ORDER BY ci.added_at DESC
            ");
            $stmt->execute([$customerId]);
            $customizedProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Combine and sort by added_at
            // Compute offer-aware fields for regular products
            foreach ($regularProducts as &$item) {
                $calc = OfferPricing::compute($item['base_price'], $item['quantity'], $item['special_offer'] ?? null);
                $item['effective_unit_price'] = $calc['unit_price'];
                $item['line_total'] = $calc['line_total'];
                $item['paid_units'] = $calc['paid_units'];
                $item['free_units'] = $calc['free_units'];
            }

            $allProducts = array_merge($regularProducts, $customizedProducts);
            usort($allProducts, function($a, $b) {
                return strtotime($b['added_at']) - strtotime($a['added_at']);
            });

            return $allProducts;

        } catch (PDOException $e) {
            error_log("Error in getCartItems: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Update item quantity in cart
     */
    public function updateQuantity($customerId, $productId, $quantity) {
        try {
            if ($quantity <= 0) {
                return $this->removeFromCart($customerId, $productId);
            }

            // For regular products, auto-adjust quantity for BxGy when the user lands on the paid threshold
            $quantityToSet = (int)$quantity;
            try {
                $s = $this->conn->prepare("SELECT p.special_offer FROM cart_items ci JOIN cart c ON ci.cart_id = c.cart_id JOIN products p ON ci.product_id = p.id WHERE c.customer_id = ? AND ci.product_id = ? LIMIT 1");
                $s->execute([$customerId, $productId]);
                $row = $s->fetch(PDO::FETCH_ASSOC);
                if ($row && isset($row['special_offer'])) {
                    $quantityToSet = OfferPricing::autoAdjustQuantity($quantityToSet, $row['special_offer']);
                }
            } catch (Exception $e) {
                // ignore and use given quantity
            }

            $stmt = $this->conn->prepare("
                UPDATE cart_items ci
                JOIN cart c ON ci.cart_id = c.cart_id
                SET ci.quantity = ?, ci.updated_at = CURRENT_TIMESTAMP
                WHERE c.customer_id = ? AND ci.product_id = ?
            ");
            $stmt->execute([$quantityToSet, $customerId, $productId]);

            if ($stmt->rowCount() > 0) {
                return ["success" => true, "message" => "Quantity updated"];
            } else {
                return ["success" => false, "message" => "Item not found in cart"];
            }

        } catch (PDOException $e) {
            error_log("Error in updateQuantity: " . $e->getMessage());
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }

    /**
     * Remove item from cart
     */
    public function removeFromCart($customerId, $productId) {
        try {
            $stmt = $this->conn->prepare("
                DELETE ci FROM cart_items ci
                JOIN cart c ON ci.cart_id = c.cart_id
                WHERE c.customer_id = ? AND ci.product_id = ?
            ");
            $stmt->execute([$customerId, $productId]);

            if ($stmt->rowCount() > 0) {
                return ["success" => true, "message" => "Item removed from cart"];
            } else {
                return ["success" => false, "message" => "Item not found in cart"];
            }

        } catch (PDOException $e) {
            error_log("Error in removeFromCart: " . $e->getMessage());
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }

    /**
     * Clear entire cart for a customer
     */
    public function clearCart($customerId) {
        try {
            $stmt = $this->conn->prepare("
                DELETE ci FROM cart_items ci
                JOIN cart c ON ci.cart_id = c.cart_id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);

            return ["success" => true, "message" => "Cart cleared successfully"];

        } catch (PDOException $e) {
            error_log("Error in clearCart: " . $e->getMessage());
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }

    /**
     * Get cart summary (total items, total price)
     */
    public function getCartSummary($customerId) {
        try {
            // Fetch items with product base price and offers to compute accurate totals
            $stmt = $this->conn->prepare("
                SELECT ci.quantity, ci.price AS stored_unit_price, p.price AS base_price, p.special_offer
                FROM cart c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN products p ON ci.product_id = p.id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $totalItems = count($rows);
            $totalQty = 0;
            $totalPrice = 0.0;
            foreach ($rows as $row) {
                $qty = (int)$row['quantity'];
                $totalQty += $qty;
                $calc = OfferPricing::compute($row['base_price'], $qty, $row['special_offer'] ?? null);
                $totalPrice += $calc['line_total'];
            }

            return [
                "total_items" => (int)$totalItems,
                "total_quantity" => (int)$totalQty,
                "total_price" => (float)round($totalPrice, 2)
            ];

        } catch (PDOException $e) {
            error_log("Error in getCartSummary: " . $e->getMessage());
            return ["total_items" => 0, "total_quantity" => 0, "total_price" => 0];
        }
    }
}
?> 