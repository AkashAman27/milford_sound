import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { handleRedirects } from '@/middleware/redirects'

export async function middleware(request: NextRequest) {
  // Handle redirects first
  const redirectResponse = await handleRedirects(request)
  if (redirectResponse && redirectResponse.status >= 300 && redirectResponse.status < 400) {
    return redirectResponse
  }
  
  // Then handle auth
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}