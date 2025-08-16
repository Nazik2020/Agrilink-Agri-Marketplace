<?php
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

            // If price not provided, get it from products table
            if ($price === null) {
                $stmt = $this->conn->prepare("SELECT price FROM products WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$product) {
                    error_log("Product not found with ID: " . $productId);
                    return ["success" => false, "message" => "Product not found"];
                }
                $price = $product['price'];
                error_log("Retrieved price from database: " . $price);
            }

            // Check if item already exists in cart
            $stmt = $this->conn->prepare("SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?");
            $stmt->execute([$cartId, $productId]);
            $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("Existing item check: " . print_r($existingItem, true));

            if ($existingItem) {
                // Update quantity
                $newQuantity = $existingItem['quantity'] + $quantity;
                error_log("Updating existing item quantity to: " . $newQuantity);
                
                $stmt = $this->conn->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = ?");
                $stmt->execute([$newQuantity, $existingItem['cart_item_id']]);
                
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
                    s.business_name as seller_name
                FROM cart c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN products p ON ci.product_id = p.id
                LEFT JOIN sellers s ON p.seller_id = s.id
                WHERE c.customer_id = ?
                ORDER BY ci.added_at DESC
            ");
            $stmt->execute([$customerId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

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

            $stmt = $this->conn->prepare("
                UPDATE cart_items ci
                JOIN cart c ON ci.cart_id = c.cart_id
                SET ci.quantity = ?, ci.updated_at = CURRENT_TIMESTAMP
                WHERE c.customer_id = ? AND ci.product_id = ?
            ");
            $stmt->execute([$quantity, $customerId, $productId]);

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
            $stmt = $this->conn->prepare("
                SELECT 
                    COUNT(ci.cart_item_id) as total_items,
                    SUM(ci.quantity) as total_quantity,
                    SUM(ci.quantity * ci.price) as total_price
                FROM cart c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);
            $summary = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                "total_items" => (int)$summary['total_items'],
                "total_quantity" => (int)$summary['total_quantity'],
                "total_price" => (float)$summary['total_price']
            ];

        } catch (PDOException $e) {
            error_log("Error in getCartSummary: " . $e->getMessage());
            return ["total_items" => 0, "total_quantity" => 0, "total_price" => 0];
        }
    }
}
?> 