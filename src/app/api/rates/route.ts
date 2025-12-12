
import { NextResponse } from 'next/server';
import { fetchRatesFromSheets } from '@/lib/googleSheetsServer';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const data = await fetchRatesFromSheets();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage || 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}

