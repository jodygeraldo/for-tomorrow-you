import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, Outlet } from '@remix-run/react'
import invariant from 'tiny-invariant'
import Tabs from '~/components/Tabs'
import { requireUser, setUser } from '~/utils/auth.server'
import { sb } from '~/utils/supabase.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/login')
  }

  const now = new Date().getTime()

  if (user.expiresIn > now) {
    const { data, error } = await sb.auth.api.refreshAccessToken(
      user.refreshToken,
    )

    if (error) {
      return redirect('/login')
    }

    invariant(data, 'should never happen')
    invariant(data.refresh_token, 'should never happen')
    invariant(data.expires_in, 'should never happen')

    return setUser(
      request,
      {
        id: user.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: now + data.expires_in,
      },
      '/',
    )
  }

  return null
}

export default function AppLayout() {
  return (
    <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h1 className="text-center text-4xl font-extrabold text-primary-9 sm:text-5xl sm:tracking-tight lg:text-6xl">
          For Tomorrow You
        </h1>

        <Tabs />

        <Form
          action="/logout"
          method="post"
          className="mt-8 flex w-full justify-end"
        >
          <button className="w-2/5 rounded-md bg-primary-3 px-4 py-2 text-primary-11 hover:bg-primary-4 hover:text-primary-12 active:bg-primary-5">
            Logout
          </button>
        </Form>

        <Outlet />
      </div>
    </div>
  )
}
