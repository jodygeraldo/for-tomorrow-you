import Card from '~/components/Card'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { requireUser } from '~/utils/auth.server'
import invariant from 'tiny-invariant'
import { deleteNote, getNotes, setFinishNote } from '~/utils/db.server'
import { CACHE_CONTROL } from '~/utils/http'
import Icon from '~/components/Icon'
import { useEffect, useState } from 'react'

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
  const [optimisticNotes, setOptimisticNotes] = useState(notes)
  const fetcher = useFetcher()

  useEffect(() => {
    const submission = fetcher.submission

    if (submission) {
      setOptimisticNotes((notes) =>
        notes.filter(
          ({ id }) => Number(fetcher.submission.formData.get('id')) !== id,
        ),
      )
    }
  }, [fetcher])

  return optimisticNotes.map((note) => (
    <Card key={note.id} note={note.note}>
      <div className="flex min-w-fit flex-col gap-2">
        <fetcher.Form
          method="post"
          replace={true}
          className="flex flex-1 items-start justify-end space-x-2"
        >
          <input type="hidden" name="id" value={note.id} />
          <button
            name="action"
            value={NoteAction.FINISH}
            className="group rounded-full border border-gray-7 p-2 hover:border-gray-8 focus:border-gray-8 focus:outline-none focus:ring-2 focus:ring-gray-8 focus:ring-offset-2 focus:ring-offset-gray-3"
          >
            <Icon
              id="check"
              className="h-4 w-4 text-green-600 group-hover:text-green-500"
            />
          </button>
          <button
            name="action"
            value={NoteAction.DELETE}
            className="group rounded-full border border-gray-7 p-2 hover:border-gray-8 focus:border-gray-8 focus:outline-none focus:ring-2 focus:ring-gray-8 focus:ring-offset-2 focus:ring-offset-gray-3"
          >
            <Icon
              id="cross"
              className="h-4 w-4 text-red-600 group-hover:text-red-500"
            />
          </button>
        </fetcher.Form>
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
