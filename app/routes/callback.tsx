import { useEffect } from 'react'
import { redirect, useLocation, useSubmit } from 'remix'
import type { ActionFunction } from 'remix'
import invariant from 'tiny-invariant'
import { commitSession, getSession } from '~/utils/auth.server'
import { sb } from '~/utils/supabase.server'

export const action: ActionFunction = async ({ request }) => {
  const hash = (await request.formData()).get('hash')

  invariant(typeof hash === 'string', 'hash should be defined')

  const hashObj = hash.slice(1).split('&')

  const accessToken = hashObj.find((item) => item.startsWith('access_token='))

  if (accessToken) {
    const { user, error } = await sb.auth.api.getUser(
      accessToken?.split('=')[1],
    )

    if (error) {
      throw new Error(error.message)
    }

    const refreshToken = hashObj.find((item) =>
      item.startsWith('refresh_token='),
    )
    const expiresIn = hashObj.find((item) => item.startsWith('expires_in='))
    invariant(
      typeof refreshToken === 'string',
      'refreshToken should be defined',
    )
    invariant(typeof expiresIn === 'string', 'expiresIn should be defined')

    const session = await getSession(request.headers.get('Cookie'))
    session.set('user', {
      id: user?.id,
      accessToken,
      refreshToken,
      expiresIn: new Date().getTime() + Number(expiresIn),
    })

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } else {
    throw new Error('Invalid access token')
  }
}

export default function AuthCallbackPage() {
  const submit = useSubmit()
  const { hash } = useLocation()

  useEffect(() => {
    submit(
      { hash },
      {
        method: 'post',
        replace: true,
      },
    )
  }, [hash, submit])

  return (
    <div>
      <h1>You will be redirected shortly.</h1>
      <noscript className="max-w-lg">
        If you see this message, it's mean you have javascript disabled, please
        enable your javascript because it's require to get the correct login
        information
      </noscript>
    </div>
  )
}
