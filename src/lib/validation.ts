
export type ValidationType = 'RANGE' | 'EXACT' | 'MULTIPLE' | 'ANY';

export interface ValidationRule {
    type: ValidationType;
    min?: number;
    max?: number;
    values?: number[];     // For EXACT values
    multipleOf?: number;   // For "Multiple of X"
    originalString: string;
}

export function parseAmountRule(amountStr: string): ValidationRule {
    const cleanStr = amountStr.toLowerCase().trim();

    // 1. "all card" or empty -> ANY
    if (!cleanStr || cleanStr === 'all card') {
        return { type: 'ANY', originalString: amountStr };
    }

    // 2. "Multiple of X"
    if (cleanStr.includes('multiple of')) {
        const match = cleanStr.match(/multiple of (\d+)/);
        if (match) {
            return {
                type: 'MULTIPLE',
                multipleOf: parseInt(match[1]),
                originalString: amountStr
            };
        }
    }

    // 3. Complex mixed case: "5(10~499)" -> Treat as Exact 5 OR Range 10-499
    // This is specific logic for that one weird format found
    if (cleanStr.includes('(') && cleanStr.includes('~')) {
        // heavy heuristic for "5(10~499)"
        const singlePart = parseInt(cleanStr.split('(')[0]);
        const rangePart = cleanStr.match(/\((\d+)~(\d+)\)/);

        if (!isNaN(singlePart) && rangePart) {
            // We can represent this as a custom check, but for now let's return a safe RANGE 
            // ensuring it covers the min/max of the whole set, or just use ANY if too complex.
            // Better approach: Let's treat it as a Range from 10-499 but also allow 5?
            // For simplicity in this iteration, let's treat "5(10~499)" as a Range 5-499 but allow gaps
            // Actually, let's just parse the range part 10-499 and add 5 as a separate valid value?
            // The Type definition doesn't support Mixed yet. Let's return ANY to be safe/lenient.
            return { type: 'ANY', originalString: amountStr };
        }
    }

    // 4. Ranges with "~" or "-"
    // "100~500", "50-100" (if exists)
    if (cleanStr.includes('~') || (cleanStr.includes('-') && !cleanStr.includes('fixed'))) {
        const separator = cleanStr.includes('~') ? '~' : '-';
        const [minStr, maxStr] = cleanStr.split(separator);
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);

        if (!isNaN(min) && !isNaN(max)) {
            return { type: 'RANGE', min, max, originalString: amountStr };
        }
    }

    // 5. Fixed values "100 fixed", "100", "50,100"
    // Remove "fixed" text
    const numOnly = cleanStr.replace('fixed', '').trim();

    if (numOnly.includes(',')) {
        // List of values: "50, 100, 200"
        const values = numOnly.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (values.length > 0) {
            return { type: 'EXACT', values, originalString: amountStr };
        }
    }

    const singleVal = parseFloat(numOnly);
    if (!isNaN(singleVal)) {
        return { type: 'EXACT', values: [singleVal], originalString: amountStr };
    }

    return { type: 'ANY', originalString: amountStr };
}

export function validateAmount(amount: number, rule: ValidationRule): { isValid: boolean; message?: string } {
    if (isNaN(amount) || amount <= 0) {
        return { isValid: false, message: 'Enter a valid amount' };
    }

    switch (rule.type) {
        case 'RANGE':
            if (amount < (rule.min || 0) || amount > (rule.max || Infinity)) {
                return { isValid: false, message: `Must be between $${rule.min} and $${rule.max}` };
            }
            break;

        case 'EXACT':
            if (!rule.values?.includes(amount)) {
                const joined = rule.values?.join(', $') || '';
                return { isValid: false, message: `Only specific amounts allowed: $${joined}` };
            }
            break;

        case 'MULTIPLE':
            if (rule.multipleOf && amount % rule.multipleOf !== 0) {
                return { isValid: false, message: `Must be a multiple of ${rule.multipleOf}` };
            }
            break;

        case 'ANY':
        default:
            break;
    }

    return { isValid: true };
}

export function getHelperText(rule: ValidationRule): string {
    switch (rule.type) {
        case 'RANGE':
            return `Allowed range: $${rule.min} - $${rule.max}`;
        case 'EXACT':
            return `Allowed amounts: $${rule.values?.join(', $')}`;
        case 'MULTIPLE':
            return `Multiples of ${rule.multipleOf}`;
        default:
            return 'Enter amount';
    }
}
