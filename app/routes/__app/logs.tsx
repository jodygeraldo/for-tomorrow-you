import Card from '~/components/Card'
import { redirect } from 'remix'
import type { LoaderFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/login')
  }

  return null
}

export default function LogPage() {
  return (
    <Card>
      <p className="text-gray-11 text-sm min-w-fit">END DATE</p>
    </Card>
  )
}
