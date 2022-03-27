import { createCookieSessionStorage, redirect } from 'remix'
import invariant from 'tiny-invariant'

invariant(process.env.AUTH_COOKIE_SECRET, 'AUTH_COOKIE_SECRET is not set')

export interface UserData {
  id: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__auth',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.AUTH_COOKIE_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
  })

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))

  const userId: UserData | undefined = session.get('user')

  return userId?.id
}

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))

  const user: UserData | undefined = session.get('user')

  return user
}

export async function setUser(
  request: Request,
  user: UserData,
  redirectTo: string,
) {
  const session = await getSession(request.headers.get('Cookie'))

  session.set('user', user)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
