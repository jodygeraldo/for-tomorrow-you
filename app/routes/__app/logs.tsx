import Card from '~/components/Card'
import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'
import { getLogs } from '~/utils/db.server'
import { CACHE_CONTROL } from '~/utils/http'

type LoaderData = {
  id: number
  note: string
  expiresAt: string
  expiresAtFormatted: string
}[]
export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/login')
  }

  const notes = (await getLogs(user.id)).sort(
    (a, b) => b.finishedAt - a.finishedAt,
  )

  return json<LoaderData>(notes, {
    status: 200,
    headers: {
      'Cache-Control': CACHE_CONTROL.safePrefetch,
    },
  })
}

export default function LogPage() {
  const notes = useLoaderData<LoaderData>()

  return notes.map((note) => (
    <Card key={note.id} note={note.note}>
      <time
        className="min-w-fit text-sm text-gray-11"
        dateTime={note.expiresAt}
      >
        {note.expiresAtFormatted}
      </time>
    </Card>
  ))
}

export function ErrorBoundary(e: Error) {
  return (
    <div className="mt-8">
      <p className="text-lg text-red-500">{e.message}</p>
    </div>
  )
}
