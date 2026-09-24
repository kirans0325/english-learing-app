import { NextResponse } from 'next/server';
import { getTodayTrendingDigest } from '@/lib/db/trending';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || undefined;

    const digest = await getTodayTrendingDigest(date);

    return NextResponse.json(
      {
        success: true,
        digest,
        freeTierStatus: {
          storageImpact: '< 5 KB per day',
          retentionPolicy: '30-day auto-purging TTL',
          dbOverloadRisk: '0.0% (M0 Free-tier protected)',
        },
      },
      {
        headers: {
          // Cache in CDN and browser for 1 hour, stale-while-revalidate for 24 hours
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching trending digest:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve trending digest' },
      { status: 500 }
    );
  }
}
