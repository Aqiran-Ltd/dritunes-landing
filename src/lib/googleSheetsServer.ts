import { google } from 'googleapis';
import { Category, Rate } from './googleSheets';

// Helpers
function parseRate(value: string): number {
    if (!value || value.trim() === '' || value === '0' || value.toLowerCase() === 'n/a') {
        return 0;
    }
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
}

function cleanCategoryName(raw: string): string {
    // Remove --- prefix/suffix and common emojis/junk
    // Example: "---Apple/iTunes👩‍💻" -> "Apple/iTunes"
    let name = raw.replace(/^---/, '').replace(/---$/, '');
    // Remove common emojis (simple range) and trimming
    name = name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    // Remove trailing numbers if any (like 4844)
    name = name.replace(/\d+$/, '');
    return name.trim();
}

/**
 * Fetch data directly from Google Sheets (Server-Side Only)
 */
export async function fetchRatesFromSheets() {
    const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!sheetId || !clientEmail || !privateKey) {
        throw new Error('Missing configuration. Check GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and NEXT_PUBLIC_GOOGLE_SHEET_ID.');
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:G500', // Increased range to capture more rows
    });

    const rows = response.data.values || [];

    const categories: Category[] = [];
    let currentCategory: Category | null = null;

    for (const row of rows) {
        if (!row || row.length === 0) continue;

        const firstCell = row[0]?.trim() || '';

        // Detect Header Row (starts with ---)
        if (firstCell.startsWith('---')) {
            const catName = cleanCategoryName(firstCell);
            // Save previous category if it has cards
            if (currentCategory && currentCategory.cards.length > 0) {
                categories.push(currentCategory);
            }
            // Start new category
            currentCategory = {
                name: catName,
                cards: []
            };
            continue;
        }

        // Skip empty or header-like rows (Product, Amount...)
        if (firstCell === 'Product' || firstCell === 'giftcards') continue;

        // If we have a current category and this looks like a data row
        if (currentCategory) {
            const product = row[0]?.trim() || '';
            const amount = row[1]?.trim() || '';

            if (!product && !amount) continue;

            const rates: Rate = {
                rmbPhysical: parseRate(row[2] || '0'),
                ghsPhysical: parseRate(row[3] || '0'),
                ghsEcode: parseRate(row[4] || '0'),
                ngnPhysical: parseRate(row[5] || '0'),
                ngnEcode: parseRate(row[6] || '0'),
            };

            const regionMatch = product.match(/_([A-Z]+)$/);
            const region = regionMatch ? regionMatch[1] : product.split('_').pop() || 'Global';

            currentCategory.cards.push({
                productName: product,
                region,
                amount,
                rates
            });
        }
    }

    // Push the last category
    if (currentCategory && currentCategory.cards.length > 0) {
        categories.push(currentCategory);
    }

    return {
        categories,
        lastUpdated: new Date().toISOString()
    };
}
