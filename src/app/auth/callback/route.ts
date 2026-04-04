import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  console.log(`Auth Callback Triggered. Code: ${code ? 'Present' : 'Missing'}, Next: ${next}`);

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth Code Exchange Error:', error.message);
      return NextResponse.redirect(`${origin}/signup?error=auth_exchange_failed&details=${encodeURIComponent(error.message)}`)
    }

    if (session?.user) {
      const user = session.user
      console.log(`Session established for: ${user.email} (${user.id})`);

      // 🛡️ v37.0/38.0 Forensic Identity Sync
      const meta = user.user_metadata
      const fullName = meta?.full_name || meta?.name || user.email?.split('@')[0] || 'Member'

      const { error: upsertError } = await supabase
        .from('users')
        .upsert([
          { 
            id: user.id, 
            email: user.email, 
            name: fullName,
            created_at: new Date().toISOString()
          }
        ], { onConflict: 'id' })

      if (upsertError) {
        console.error('Forensic Sync Failed:', upsertError.message);
        // We still redirect because they have a valid session, 
        // but the dashboard guard might kick them if this failed.
      } else {
        console.log('Forensic Sync Successful: User registered as Member.');
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  console.warn('Auth Callback reached without code or valid session.');
  return NextResponse.redirect(`${origin}/signup?error=no_auth_code`)
}
