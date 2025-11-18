import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Logout endpoint
 * Clears the authentication session cookie
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear session cookie
  response.cookies.delete('auth_session');
  
  return response;
}

