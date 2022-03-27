import { createCookieSessionStorage } from 'remix'
import invariant from 'tiny-invariant'

invariant(process.env.AUTH_COOKIE_SECRET, 'AUTH_COOKIE_SECRET is not set')

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
