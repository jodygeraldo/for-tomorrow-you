import Card from '~/components/Card'
import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'
import invariant from 'tiny-invariant'
import { Notes } from '~/utils/types.server'
import { sb } from '~/utils/supabase.server'

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

  const { error, data } = await sb.from<Notes>('notes').select('*')

  if (error) {
    console.log(error)
    return json({ error: 'error' })
  }

  invariant(data, 'data should be an array')

  const now = new Date().getTime()

  const notesMap = data.filter(
    (note) => note.expires_at < now || note.done === true,
  )

  const notes = notesMap.map((note) => {
    return {
      id: note.id,
      note: note.notes,
      expiresAt: `${new Date(note.expires_at)}`,
      expiresAtFormatted: Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(note.expires_at)),
    }
  })

  return json<LoaderData>(notes, 200)
}

export default function LogPage() {
  const notes = useLoaderData<LoaderData>()

  return notes.map((note) => (
    <Card key={note.id} note={note.note}>
      <time
        className="text-gray-11 text-sm min-w-fit"
        dateTime={note.expiresAt}
      >
        {note.expiresAtFormatted}
      </time>
    </Card>
  ))
}
