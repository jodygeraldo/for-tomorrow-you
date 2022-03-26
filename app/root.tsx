import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction, LinksFunction } from 'remix'
import tailwindcssStylesUrl from '~/tailwind.css'
import darkThemeStylesUrl from '~/dark-theme.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'For Tomorrow You',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindcssStylesUrl },
  {
    rel: 'stylesheet',
    href: darkThemeStylesUrl,
    media: '(prefers-color-scheme: dark)',
  },
]

export default function App() {
  return (
    <html lang="en" className="dark-theme">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-1">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
