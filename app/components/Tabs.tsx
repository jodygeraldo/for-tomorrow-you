import clsx from 'clsx'
import { NavLink, useLocation, useNavigate } from 'remix'

const tabs = [
  { name: 'Note', to: '/' },
  { name: 'Log', to: '/logs' },
]

export default function Tabs() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const selected = e.target.options.selectedIndex === 0 ? '/' : '/logs'

    navigate(selected)
  }

  return (
    <div className="mt-8">
      <form className="sm:hidden" onChange={handleChange}>
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full appearance-none rounded-md border border-gray-7 bg-gray-2 px-3 py-2 text-gray-12 placeholder-gray-11 shadow-sm focus:border-primary-8 focus:outline-none focus:ring-primary-8 sm:text-sm"
          defaultValue={location.pathname === '/' ? 'Note' : 'Log'}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </form>
      <div className="hidden sm:block">
        <div className="border-b border-gray-7">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                prefetch="intent"
                key={tab.name}
                to={tab.to}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'border-primary-10 text-primary-9'
                      : 'border-transparent text-gray-11 hover:border-gray-8 hover:text-gray-12',
                    'w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium',
                  )
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
