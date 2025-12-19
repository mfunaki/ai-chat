import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Basic認証をスキップする環境変数
  const skipAuth = process.env.SKIP_BASIC_AUTH === 'true'
  if (skipAuth) {
    return NextResponse.next()
  }

  // Basic認証の認証情報
  const basicAuthUser = process.env.BASIC_AUTH_USER || 'admin'
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD || 'password'

  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  const auth = authHeader.split(' ')[1]
  const [user, password] = Buffer.from(auth, 'base64').toString().split(':')

  if (user === basicAuthUser && password === basicAuthPassword) {
    return NextResponse.next()
  }

  return new NextResponse('Invalid credentials', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

// Basic認証を適用するパス（全てのパスに適用）
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
