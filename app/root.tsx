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

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
  title: 'For Tomorrow You',
  description: 'Let computer remember it for you',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindcssStylesUrl },
]

export default function App() {
  return (
    <html lang="en" className="dark-theme h-full bg-gray-1">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
