import { Form, redirect, useTransition } from 'remix'
import type { ActionFunction } from 'remix'
import { sb } from '~/utils/supabase.server'
import { requireUser } from '~/utils/auth.server'
import { Notes } from '~/utils/types.server'
import invariant from 'tiny-invariant'
import { useEffect, useRef } from 'react'

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request)

  if (!user) {
    return redirect('/')
  }

  const notes = (await request.formData()).get('note')

  invariant(typeof notes === 'string', 'note should be a string')

  const now = new Date().getTime()
  const expires_at = now + 24 * 60 * 60 * 1000

  const { error } = await sb.from<Notes>('notes').insert([
    {
      user_id: user.id,
      notes,
      expires_at,
      inserted_at: now,
    },
  ])

  if (error) {
    console.log(error)
    return null
  }

  return null
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
            className="appearance-none block w-full px-3 py-2 border border-gray-7 rounded-md shadow-sm placeholder-gray-11 focus:outline-none focus:ring-primary-8 focus:border-primary-8 sm:text-sm bg-gray-2 text-gray-12 disabled:bg-gray-7 disabled:cursor-not-allowed"
            placeholder="Your note"
            required
            minLength={3}
          />
        </div>
        <button className="mt-4 px-4 py-2 text-center bg-primary-9 hover:bg-primary-10 flex-1 text-white rounded-md w-full disabled:bg-primary-6">
          {busy ? 'Adding note...' : 'Add new note'}
        </button>
      </fieldset>
    </Form>
  )
}
