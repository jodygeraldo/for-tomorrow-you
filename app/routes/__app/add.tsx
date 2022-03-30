import { Form, redirect, useTransition } from 'remix'
import type { ActionFunction } from 'remix'
import { requireUser } from '~/utils/auth.server'
import invariant from 'tiny-invariant'
import { useEffect, useRef } from 'react'
import { addNote } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/')
  }

  const note = (await request.formData()).get('note')

  invariant(typeof note === 'string', 'note should be a string')

  await addNote(user.id, note)

  return new Response(null, { status: 204 })
}

export default function () {
  const { state } = useTransition()
  const busy = state === 'submitting'
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state === 'loading') {
      ref.current?.reset()
    }
  }, [state])

  return (
    <Form ref={ref} className="mt-6" method="post">
      <fieldset disabled={busy}>
        <div>
          <label htmlFor="note" className="sr-only">
            Note
          </label>
          <textarea
            name="note"
            id="note"
            rows={6}
            className="block w-full appearance-none rounded-md border border-gray-7 bg-gray-2 px-3 py-2 text-gray-12 placeholder-gray-11 shadow-sm focus:border-primary-8 focus:outline-none focus:ring-primary-8 disabled:cursor-not-allowed disabled:bg-gray-7 sm:text-sm"
            placeholder="Your note"
            required
            minLength={3}
          />
        </div>
        <button className="mt-4 w-full flex-1 rounded-md bg-primary-9 px-4 py-2 text-center text-white hover:bg-primary-10 disabled:bg-primary-6">
          {busy ? 'Adding note...' : 'Add new note'}
        </button>
      </fieldset>
    </Form>
  )
}

export function ErrorBoundary(e: Error) {
  return (
    <div className="mt-8">
      <p className="text-lg text-red-500">{e.message}</p>
    </div>
  )
}
