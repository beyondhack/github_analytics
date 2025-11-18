import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuthTokenResponse, AuthSession } from '@/types/auth';

export const dynamic = 'force-dynamic';

/**
 * Handle GitHub OAuth callback
 * Exchange authorization code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validate state (CSRF protection)
  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;
  
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL('/?error=invalid_state', request.url)
    );
  }

  // Validate code
  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=missing_code', request.url)
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/?error=oauth_not_configured', request.url)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${appUrl}/api/auth/callback/github`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData: OAuthTokenResponse = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error);
    }

    // Fetch user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Analytics-Dashboard',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Create session
    const session: AuthSession = {
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        email: userData.email,
      },
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    };

    // Store session in httpOnly cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Clear OAuth state cookie
    response.cookies.delete('oauth_state');
    
    // Set session cookie
    response.cookies.set('auth_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=oauth_failed', request.url)
    );
  }
}

