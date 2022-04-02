import invariant from 'tiny-invariant'
import { sb } from './supabase.server'
import { Notes } from './types.server'

function mapNotes(notes: Notes[]) {
  return notes.map((note) => {
    return {
      id: note.id,
      note: note.notes,
      expiresAt: `${new Date(note.expires_at)}`,
      expiresAtFormatted: Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(note.expires_at)),
      finishedAt: note.finished_at,
    }
  })
}

export async function addNote(userId: string, note: string) {
  const now = new Date().getTime()
  const expires_at = now + 24 * 60 * 60 * 1000

  const { error } = await sb.from<Notes>('notes').insert([
    {
      user_id: userId,
      notes: note,
      expires_at,
      inserted_at: now,
      finished_at: now,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }
}

export async function getNotes(userId: string) {
  const { error, data } = await sb
    .from<Notes>('notes')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  invariant(data, 'data should be an array')

  const now = new Date().getTime()

  const notesMap = data.filter(
    (note) =>
      note.expires_at > now && (note.done === null || note.done === false),
  )

  const notes = mapNotes(notesMap)

  return notes
}

export async function getLogs(userId: string) {
  const { error, data } = await sb
    .from<Notes>('notes')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  invariant(data, 'data should be an array')

  const now = new Date().getTime()

  const notesMap = data.filter(
    (note) => note.expires_at < now || note.done === true,
  )

  const notes = mapNotes(notesMap)

  return notes
}

export async function setFinishNote(userId: string, noteId: string) {
  const now = new Date().getTime()

  const { error } = await sb
    .from<Notes>('notes')
    .update({ done: true, finished_at: now })
    .eq('user_id', userId)
    .eq('id', noteId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteNote(userId: string, noteId: string) {
  const { error } = await sb
    .from('notes')
    .delete()
    .eq('user_id', userId)
    .eq('id', noteId)

  if (error) {
    throw new Error(error.message)
  }
}
