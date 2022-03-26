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
          className="appearance-none block w-full px-3 py-2 border border-gray-7 rounded-md shadow-sm placeholder-gray-11 focus:outline-none focus:ring-primary-8 focus:border-primary-8 sm:text-sm bg-gray-2 text-gray-12"
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
                key={tab.name}
                to={tab.to}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'border-primary-10 text-primary-9'
                      : 'border-transparent text-gray-11 hover:text-gray-12 hover:border-gray-8',
                    'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm',
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
