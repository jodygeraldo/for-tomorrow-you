import { Form, Link, Outlet, redirect, useLocation } from 'remix'
import type { LoaderFunction } from 'remix'
import Tabs from '~/components/Tabs'
import { requireUser, setUser } from '~/utils/auth.server'
import { sb } from '~/utils/supabase.server'
import invariant from 'tiny-invariant'

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
  const { pathname } = useLocation()

  const isAddPage = pathname === '/add'

  return (
    <div className="min-h-full py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h1 className="text-center text-4xl font-extrabold text-primary-9 sm:text-5xl sm:tracking-tight lg:text-6xl">
          For Tommorrow You
        </h1>

        <Tabs />

        <div className="mt-8 flex justify-end gap-4">
          {isAddPage ? null : (
            <Link
              prefetch="intent"
              to="/add"
              className="flex-1 rounded-md bg-primary-9 px-4 py-2 text-center text-white hover:bg-primary-10"
            >
              Add new note
            </Link>
          )}

          <Form action="/logout" method="post">
            <button className="rounded-md bg-primary-3 px-4 py-2 text-primary-11 hover:bg-primary-4 hover:text-primary-12 active:bg-primary-5">
              Logout
            </button>
          </Form>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
