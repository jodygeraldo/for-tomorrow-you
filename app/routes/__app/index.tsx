import ButtonGroup from '~/components/ButtonGroup'
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

export default function Index() {
  return (
    <Card>
      <div className="flex flex-col gap-2 min-w-fit">
        <ButtonGroup />
        <p className="text-gray-11 text-sm self-end">END DATE</p>
      </div>
    </Card>
  )
}
