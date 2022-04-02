import { redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { destroySession, getSession } from '~/utils/auth.server'

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export const loader: LoaderFunction = () => {
  return redirect('/')
}

export default function LogoutPage() {
  return null
}
