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
        <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl text-primary-9 text-center">
          For Tommorrow You
        </h1>

        <Tabs />

        <div className="mt-8 flex gap-4 justify-end">
          {isAddPage ? null : (
            <Link
              to="/add"
              className="px-4 py-2 text-center bg-primary-9 hover:bg-primary-10 flex-1 text-white rounded-md"
            >
              Add new note
            </Link>
          )}

          <Form action="/logout" method="post">
            <button className="px-4 py-2 bg-primary-3 hover:bg-primary-4 active:bg-primary-5 text-primary-11 hover:text-primary-12 rounded-md">
              Logout
            </button>
          </Form>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
