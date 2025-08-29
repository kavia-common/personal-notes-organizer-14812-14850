'use strict';

const FileStore = require('../db/fileStore');
const { getConfig } = require('../config/env');
const { createNote } = require('../models/note');

const { storageFilePath } = getConfig();
// In future, switch to another adapter based on NOTES_DB_URL.
const store = new FileStore(storageFilePath);

// PUBLIC_INTERFACE
class NotesService {
  /**
   * Service layer for notes operations with simple per-user scoping.
   */

  listNotes(userId) {
    /** Return all notes for a given userId. */
    const all = store.getAll();
    return all.filter((n) => n.userId === userId);
  }

  getNote(userId, id) {
    /** Retrieve a single note by id scoped to userId. */
    const note = store.getById(id);
    if (!note || note.userId !== userId) return null;
    return note;
  }

  createNote({ title, content, userId }) {
    /** Create a new note for userId. */
    const note = createNote({ title, content, userId });
    return store.create(note);
  }

  updateNote(userId, id, patch) {
    /** Update an existing note (title/content) if owned by userId. */
    const existing = store.getById(id);
    if (!existing || existing.userId !== userId) return null;
    const payload = {};
    if (patch.title !== undefined) payload.title = patch.title;
    if (patch.content !== undefined) payload.content = patch.content;
    return store.update(id, payload);
  }

  deleteNote(userId, id) {
    /** Delete a note if owned by userId. Returns true/false. */
    const existing = store.getById(id);
    if (!existing || existing.userId !== userId) return false;
    return store.remove(id);
  }
}

module.exports = new NotesService();
