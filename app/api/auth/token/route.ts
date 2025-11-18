import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthSession } from '@/types/auth';

export const dynamic = 'force-dynamic';

/**
 * Get user's access token (for API calls)
 * This endpoint is used by the client to get the authenticated user's token
 * for making GitHub API requests
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ token: null });
    }

    const session: AuthSession = JSON.parse(sessionCookie);

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return NextResponse.json({ token: null });
    }

    // Return access token
    return NextResponse.json({ token: session.accessToken });
  } catch (error) {
    console.error('Token fetch error:', error);
    return NextResponse.json({ token: null });
  }
}

