import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthSession } from '@/types/auth';

export const dynamic = 'force-dynamic';

/**
 * Get current authentication session
 * Returns user session if authenticated, null otherwise
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ session: null });
    }

    const session: AuthSession = JSON.parse(sessionCookie);

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Clear expired session
      const response = NextResponse.json({ session: null });
      response.cookies.delete('auth_session');
      return response;
    }

    // Return session without access token for security
    return NextResponse.json({
      session: {
        user: session.user,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ session: null });
  }
}

