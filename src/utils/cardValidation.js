// Lightweight card validation utilities for BuyNowModal

export const CARD_BRANDS = {
  visa: 'visa',
  mastercard: 'mastercard',
  amex: 'amex',
  discover: 'discover',
  diners: 'diners',
  jcb: 'jcb',
  unionpay: 'unionpay',
  maestro: 'maestro',
  unknown: 'unknown',
};

function luhnCheck(numberString) {
  const digits = (numberString || '').replace(/\D/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(numberString) {
  const n = (numberString || '').replace(/\s|-/g, '');
  if (/^4\d{0,}$/.test(n)) return CARD_BRANDS.visa;
  // MasterCard: 51-55, 2221-2720
  if (/^(5[1-5]\d{0,}|22(2[1-9]|[3-9]\d)|2[3-6]\d{2}|27([01]\d|20))\d*$/.test(n)) return CARD_BRANDS.mastercard;
  if (/^3[47]\d{0,}$/.test(n)) return CARD_BRANDS.amex;
  if (/^6(?:011|5\d{2})\d{0,}$/.test(n)) return CARD_BRANDS.discover;
  if (/^3(?:0[0-5]|[68]\d)\d{0,}$/.test(n)) return CARD_BRANDS.diners;
  if (/^(?:2131|1800|35\d{0,})$/.test(n)) return CARD_BRANDS.jcb;
  if (/^62\d{0,}$/.test(n)) return CARD_BRANDS.unionpay;
  if (/^(?:50|5[6-9]|6[0-9])\d{0,}$/.test(n)) return CARD_BRANDS.maestro;
  return CARD_BRANDS.unknown;
}

function validateExpiry(expiry) {
  // Accept formats: MM/YY, MMYY
  let v = String(expiry || '').replace(/\s/g, '');
  if (/^\d{2}$/.test(v)) return { valid: false, error: 'Expiry must be MM/YY' };
  if (/^\d{4}$/.test(v)) v = `${v.slice(0, 2)}/${v.slice(2)}`;
  if (!/^\d{2}\/\d{2}$/.test(v)) return { valid: false, error: 'Expiry must be MM/YY' };
  const [mmStr, yyStr] = v.split('/');
  const month = parseInt(mmStr, 10);
  const year = 2000 + parseInt(yyStr, 10);
  if (month < 1 || month > 12) return { valid: false, error: 'Invalid expiry month' };
  const now = new Date();
  const expDate = new Date(year, month, 1);
  // Card expires at the end of the month, allow current month
  const startOfNextMonth = new Date(year, month, 1);
  if (startOfNextMonth <= now) return { valid: false, error: 'Card expired' };
  return { valid: true };
}

function validateCvc(cvc, brand) {
  const cleaned = String(cvc || '').replace(/\D/g, '');
  const requiredLength = brand === CARD_BRANDS.amex ? 4 : 3;
  if (cleaned.length !== requiredLength) {
    return { valid: false, error: `CVC must be ${requiredLength} digits` };
  }
  return { valid: true };
}

export function validateCardAll({ number, expiry, cvc }) {
  const numberStr = String(number || '').replace(/\s|-/g, '');
  if (!numberStr) return { valid: false, error: 'Card number is required' };
  const brand = detectCardBrand(numberStr);
  // Enforce brand-specific length before Luhn to give clearer errors
  const len = numberStr.length;
  if (brand === CARD_BRANDS.amex && len !== 15) {
    return { valid: false, error: 'American Express must be 15 digits' };
  }
  if (brand !== CARD_BRANDS.amex && len !== 16) {
    return { valid: false, error: 'Card number must be 16 digits' };
  }
  if (!luhnCheck(numberStr)) return { valid: false, error: 'Invalid card number' };
  const exp = validateExpiry(expiry);
  if (!exp.valid) return exp;
  const c = validateCvc(cvc, brand);
  if (!c.valid) return c;
  return { valid: true, brand };
}

export default {
  CARD_BRANDS,
  detectCardBrand,
  validateCardAll,
};


