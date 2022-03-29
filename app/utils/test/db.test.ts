import {
  addNote,
  getNotes,
  getLogs,
  setFinishNote,
  deleteNote,
  deleteNotes,
} from '../db.server'

const testAccountId = '607071e4-4bd6-43d5-9490-8e70ae981f97'
const anotherTestAccountId = '6ab91482-3a1e-444e-bce5-71d42ed58c10'

afterAll(async () => {
  await deleteNotes(testAccountId)
  await deleteNotes(anotherTestAccountId)
})

describe('Database utils', () => {
  it('should be able to add new note and not throw', async () => {
    expect(
      await addNote(testAccountId, 'new node on first account'),
    ).toMatchObject({
      noteId: expect.any(Number),
      userId: testAccountId,
    })
    expect(
      await addNote(anotherTestAccountId, 'new node on second account'),
    ).toMatchObject({
      noteId: expect.any(Number),
      userId: anotherTestAccountId,
    })
  })

  it("should only able to see it's own notes", async () => {
    expect(await getNotes(testAccountId)).toHaveLength(1)
  })

  it('should be able to set note as finish', async () => {
    const notes = await getNotes(testAccountId)
    const noteId = notes[0].id

    expect(await setFinishNote(testAccountId, `${noteId}`)).toMatchObject({
      noteId,
      userId: testAccountId,
    })
  })

  it('finished note should be on logs', async () => {
    expect(await getLogs(testAccountId)).toHaveLength(1)
  })

  it('should be able to delete note', async () => {
    const notes = await getNotes(anotherTestAccountId)
    const noteId = notes[0].id

    expect(await deleteNote(anotherTestAccountId, `${noteId}`)).toMatchObject({
      noteId,
      userId: anotherTestAccountId,
    })
  })
})
