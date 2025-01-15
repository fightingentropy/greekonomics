import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 60, // Cache for 60 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}
