import { createServerClient } from "@supabase/auth-helpers-nextjs"
import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { AUTH_APP_URL } from "@/lib/supabase/auth-urls"

const ALLOWED_OTP_TYPES: EmailOtpType[] = [
  "signup",
  "magiclink",
  "recovery",
  "invite",
  "email",
  "email_change",
]

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login", AUTH_APP_URL))
  }

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const tokenHash = requestUrl.searchParams.get("token_hash")
  const otpType = requestUrl.searchParams.get("type")

  const isRecoveryFlow = otpType === "recovery"
  const successPath = isRecoveryFlow ? "/reset-password" : "/dashboard"
  const successRedirect = NextResponse.redirect(new URL(successPath, AUTH_APP_URL))

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          successRedirect.cookies.set(name, value, options)
        })
      },
    },
  })

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return successRedirect
    }
  }

  if (tokenHash && otpType && ALLOWED_OTP_TYPES.includes(otpType as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as EmailOtpType,
    })

    if (!error) {
      return successRedirect
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback", AUTH_APP_URL))
}
