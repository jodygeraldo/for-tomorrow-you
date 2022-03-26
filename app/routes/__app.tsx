import { Outlet } from 'remix'
import Tabs from '~/components/Tabs'

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
