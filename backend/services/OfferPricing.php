<?php
/**
 * OfferPricing - Helper to parse and apply special offers
 * Supports:
 *  - Percentage discounts: "10% Off"
 *  - Buy X Get Y Free: "Buy 1 Get 1 Free", "Buy 2 Get 1 Free"
 */

class OfferPricing {
    /** Parse a special offer string */
    public static function parse($offer) {
        if (!$offer) return ['type' => 'none'];

        $offer = trim($offer);
        // Percentage like "10% Off"
        if (preg_match('/^(\d{1,2}|100)\s*%\s*Off$/i', $offer, $m)) {
            $pct = (int)$m[1];
            $pct = max(0, min(100, $pct));
            return ['type' => 'percent', 'value' => $pct];
        }

        // Buy X Get Y Free
        if (preg_match('/^Buy\s*(\d+)\s*Get\s*(\d+)\s*Free$/i', $offer, $m)) {
            $buy = max(1, (int)$m[1]);
            $free = max(1, (int)$m[2]);
            return ['type' => 'bxgy', 'buy' => $buy, 'free' => $free];
        }

        return ['type' => 'none'];
    }

    /**
     * Optionally auto-adjust quantity for certain offers
     * - For Buy 1 Get 1 Free: if quantity is 1, bump to 2 to reflect free item
     */
    public static function autoAdjustQuantity($quantity, $offer) {
        $parsed = is_array($offer) ? $offer : self::parse($offer);
        if ($quantity <= 0) return 0;

        if ($parsed['type'] === 'bxgy') {
            $buy = $parsed['buy'];
            $free = $parsed['free'];
            $group = max(1, $buy + $free);

            // If the customer's chosen quantity ends exactly at the paid threshold
            // of the final (incomplete) group, automatically add the free units.
            // Examples:
            //  - B1G1: qty=1 -> 2 (1 paid + 1 free)
            //  - B2G1: qty=2 -> 3 (2 paid + 1 free)
            //  - B3G2: qty=3 -> 5 (3 paid + 2 free)
            $rem = $quantity % $group;
            if ($rem === $buy) {
                return $quantity + $free;
            }
        }

        return $quantity;
    }

    /**
     * Compute effective pricing for a given base price, quantity and offer
     * Returns array: [unit_price, line_total, paid_units, free_units, adjusted_qty]
     */
    public static function compute($basePrice, $quantity, $offer) {
        $basePrice = (float)$basePrice;
        $quantity = (int)$quantity;
        $parsed = is_array($offer) ? $offer : self::parse($offer);

        if ($quantity <= 0 || $basePrice < 0) {
            return [
                'unit_price' => max(0.0, $basePrice),
                'line_total' => 0.0,
                'paid_units' => 0,
                'free_units' => 0,
                'adjusted_qty' => max(0, $quantity)
            ];
        }

        // Default: no offer
        $adjustedQty = self::autoAdjustQuantity($quantity, $parsed);
        $paidUnits = $quantity;
        $freeUnits = 0;
        $unitPrice = $basePrice;

    // We'll compute a case-specific line total; default is simple qty * base
    $lineTotal = round($quantity * $basePrice, 2);

    switch ($parsed['type']) {
            case 'percent':
                $discount = ($parsed['value'] ?? 0) / 100.0;
                $unitPrice = round($basePrice * (1.0 - $discount), 2);
        // Line total is discounted unit price times quantity
        $lineTotal = round($unitPrice * $quantity, 2);
                break;

            case 'bxgy':
                $buy = $parsed['buy'];
                $free = $parsed['free'];
                $group = $buy + $free;
                if ($group <= 0) $group = 1;

                // Use adjusted quantity for pricing (so unit price reflects freebies delivered)
                $q = $adjustedQty;
                $fullGroups = intdiv($q, $group);
                $remainder = $q - ($fullGroups * $group);
                $paidUnits = ($fullGroups * $buy) + min($remainder, $buy);
                $freeUnits = $q - $paidUnits;
                // Effective unit price so that adjusted_qty * unit = paidUnits * base
                $unitPrice = round(($paidUnits * $basePrice) / max(1, $q), 2);
                // For BxGy, you pay for paidUnits at base price
                $lineTotal = round($paidUnits * $basePrice, 2);
                break;

            case 'none':
            default:
                // keep defaults
                break;
        }

        // Line total computed per-offer type above
        return [
            'unit_price' => $unitPrice,
            'line_total' => $lineTotal,
            'paid_units' => $paidUnits,
            'free_units' => $freeUnits,
            'adjusted_qty' => $adjustedQty
        ];
    }
}
?>
