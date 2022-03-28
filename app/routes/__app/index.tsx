import ButtonGroup from '~/components/ButtonGroup'
import Card from '~/components/Card'
import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction, ActionFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'
import { sb } from '~/utils/supabase.server'
import { Notes } from '~/utils/types.server'
import invariant from 'tiny-invariant'

export enum NoteAction {
  DELETE = 'DELETE',
  FINISH = 'FINISH',
}
export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const action = formData.get('action')
  const id = formData.get('id')

  invariant(typeof action === 'string', 'action should be defined')
  invariant(typeof id === 'string', 'id is required')

  switch (action) {
    case NoteAction.FINISH:
      const { error: errorFinish } = await sb
        .from<Notes>('notes')
        .update({ done: true })
        .eq('user_id', user.id)
        .eq('id', id)

      if (errorFinish) {
        return json({ error: errorFinish.message }, 500)
      }

      return json({ success: true })

    case NoteAction.DELETE:
      const { error: errorDelete } = await sb
        .from('notes')
        .delete()
        .eq('user_id', user.id)
        .eq('id', id)

      if (errorDelete) {
        return json({ error: errorDelete.message }, 500)
      }

      return json({ success: true })
    default:
      return null
  }
}

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

  const { error, data } = await sb
    .from<Notes>('notes')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.log(error)
    return json({ error: 'error' })
  }

  invariant(data, 'data should be an array')

  const now = new Date().getTime()

  const notesMap = data.filter(
    (note) =>
      note.expires_at > now && (note.done === null || note.done === false),
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

export default function Index() {
  const notes = useLoaderData<LoaderData>()

  return notes.map((note) => (
    <Card key={note.id} note={note.note}>
      <div className="flex min-w-fit flex-col gap-2">
        <ButtonGroup id={note.id} />
        <time
          className="self-end text-sm text-gray-11"
          dateTime={note.expiresAt}
        >
          {note.expiresAtFormatted}
        </time>
      </div>
    </Card>
  ))
}
