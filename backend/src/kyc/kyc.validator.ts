// Official UIDAI Verhoeff algorithm for 12-digit Indian Aadhaar validation
const d: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const p: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const inv: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export function validateVerhoeff(numStr: string): boolean {
  if (!/^\d+$/.test(numStr)) return false;
  let c = 0;
  const reversed = numStr.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[i % 8][reversed[i]]];
  }
  return c === 0;
}

export function generateVerhoeff(numStr: string): string {
  let c = 0;
  const reversed = numStr.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[(i + 1) % 8][reversed[i]]];
  }
  return `${numStr}${inv[c]}`;
}

// 36 Recognized Indian State & Union Territory RTO codes
export const INDIAN_STATE_RTO_CODES = new Set([
  'AN', 'AP', 'AR', 'AS', 'BR', 'CG', 'CH', 'DD', 'DL', 'DN',
  'GA', 'GJ', 'HP', 'HR', 'JH', 'JK', 'KA', 'KL', 'LA', 'LD',
  'MH', 'ML', 'MN', 'MP', 'MZ', 'NL', 'OD', 'PB', 'PY', 'RJ',
  'SK', 'TN', 'TR', 'TS', 'UK', 'UP', 'WB',
]);

export interface KycValidationResult {
  isValid: boolean;
  error?: string;
  normalizedAadhaar?: string;
  normalizedDl?: string;
}

export function validateIndianKyc(aadhaarNumber: string, dlNumber: string, dlExpiry?: string): KycValidationResult {
  // 1. Aadhaar Validation
  const cleanAadhaar = aadhaarNumber.replace(/[\s-]/g, '');
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return {
      isValid: false,
      error: 'Aadhaar must be a 12-digit numeric identity number.',
    };
  }

  if (cleanAadhaar.startsWith('0') || cleanAadhaar.startsWith('1')) {
    return {
      isValid: false,
      error: 'Aadhaar number cannot begin with 0 or 1 under UIDAI specifications.',
    };
  }

  if (!validateVerhoeff(cleanAadhaar)) {
    return {
      isValid: false,
      error: 'Invalid Aadhaar number: Failed UIDAI Verhoeff checksum validation.',
    };
  }

  // 2. Driving License Validation
  const cleanDl = dlNumber.replace(/[\s-]/g, '').toUpperCase();
  if (cleanDl.length < 13 || cleanDl.length > 16) {
    return {
      isValid: false,
      error: 'Driving License number must be between 13 and 16 characters according to MoRTH format (e.g. KA0420210087462).',
    };
  }

  const stateCode = cleanDl.slice(0, 2);
  if (!INDIAN_STATE_RTO_CODES.has(stateCode)) {
    return {
      isValid: false,
      error: `Invalid DL state code '${stateCode}'. Must match an authentic Indian State/UT code (e.g. KA, MH, DL, GA).`,
    };
  }

  // Check DL expiry if provided
  if (dlExpiry) {
    const expiry = new Date(dlExpiry);
    if (isNaN(expiry.getTime()) || expiry < new Date()) {
      return {
        isValid: false,
        error: 'Driving License has expired. An active, valid license is mandatory for rental under CMVR Rule 1989.',
      };
    }
  }

  return {
    isValid: true,
    normalizedAadhaar: cleanAadhaar,
    normalizedDl: cleanDl,
  };
}
