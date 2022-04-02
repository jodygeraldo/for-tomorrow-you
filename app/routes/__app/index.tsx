import ButtonGroup from '~/components/ButtonGroup'
import Card from '~/components/Card'
import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction, ActionFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'
import invariant from 'tiny-invariant'
import { deleteNote, getNotes, setFinishNote } from '~/utils/db.server'
import { CACHE_CONTROL } from '~/utils/http'

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
      await setFinishNote(user.id, id)

      return new Response(null, { status: 204 })
    case NoteAction.DELETE:
      await deleteNote(user.id, id)

      return new Response(null, { status: 204 })
    default:
      throw new Error('Invalid action')
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

  const notes = await getNotes(user.id)

  return json<LoaderData>(notes, {
    status: 200,
    headers: {
      'Cache-Control': CACHE_CONTROL.safePrefetch,
    },
  })
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

export function ErrorBoundary(e: Error) {
  return (
    <div className="mt-8">
      <p className="text-lg text-red-500">{e.message}</p>
    </div>
  )
}
