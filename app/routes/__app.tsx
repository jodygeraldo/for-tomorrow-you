import { Outlet, redirect } from 'remix'
import type { LoaderFunction } from 'remix'
import Tabs from '~/components/Tabs'
import { requireUser } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/login')
  }

  return null
}

export default function AppLayout() {
  return (
    <div className="min-h-full py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl text-primary-9 text-center">
          For Tommorrow You
        </h1>

        <Tabs />

        <Outlet />
      </div>
    </div>
  )
}
