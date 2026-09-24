import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { canUserDownloadPdf, recordPdfDownload, getTodayDateString } from '@/lib/db/pdf-downloads';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        allowed: false,
        remaining: 0,
        message: 'Please log in to download printable lesson PDFs.',
      });
    }

    const quota = await canUserDownloadPdf(session.userId);

    return NextResponse.json({
      authenticated: true,
      allowed: quota.allowed,
      remaining: quota.remaining,
      downloadDate: quota.downloadDate,
      user: {
        name: session.name,
        email: session.email,
      },
    });
  } catch (err: any) {
    console.error('PDF status check error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to check PDF quota' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: 'unauthorized',
          message: 'Please log in to download or print lesson PDFs with watermark.',
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
    const title = typeof body?.title === 'string' ? body.title.trim() : '';

    if (!slug) {
      return NextResponse.json(
        { error: 'invalid_request', message: 'Lesson slug is required.' },
        { status: 400 }
      );
    }

    const quota = await canUserDownloadPdf(session.userId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: 'quota_exceeded',
          message: 'Daily download limit reached: Free accounts can download 1 lesson PDF per day. Please return tomorrow!',
          remaining: 0,
          resetDate: getTodayDateString(),
        },
        { status: 429 }
      );
    }

    const recordResult = await recordPdfDownload({
      userId: session.userId,
      email: session.email,
      postSlug: slug,
      postTitle: title,
    });

    if (!recordResult.success) {
      return NextResponse.json(
        {
          error: 'quota_exceeded',
          message: recordResult.message || 'Daily limit reached.',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      siteName: 'EnglishFlow',
      watermarkText: `EnglishFlow — Master Practical English • Member: ${session.email} • ${getTodayDateString()}`,
      remaining: 0,
      user: {
        name: session.name,
        email: session.email,
      },
    });
  } catch (err: any) {
    console.error('PDF download record error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process PDF download request' },
      { status: 500 }
    );
  }
}
