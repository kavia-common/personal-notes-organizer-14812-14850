'use strict';

const notesService = require('../services/notes');
const { validateNotePayload } = require('../models/note');

// For demo, userId is pulled from header x-user-id; in a real app, use auth middleware.

function getUserId(req) {
  return req.header('x-user-id') || '';
}

class NotesController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /**
     * List all notes for the requesting user.
     * Query/Headers:
     *   - x-user-id (header): required user identifier
     * Returns: 200 with array of notes
     */
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(400).json({ message: 'x-user-id header is required' });
      const notes = await notesService.listNotes(userId);
      return res.status(200).json(notes);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /**
     * Get a single note by id for the requesting user.
     * Params:
     *   - id: note id
     * Headers:
     *   - x-user-id: required user identifier
     * Returns: 200 with note or 404 if not found
     */
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(400).json({ message: 'x-user-id header is required' });
      const { id } = req.params;
      const note = await notesService.getNote(userId, id);
      if (!note) return res.status(404).json({ message: 'Note not found' });
      return res.status(200).json(note);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /**
     * Create a new note for the requesting user.
     * Body:
     *   - title: string (required)
     *   - content: string (required)
     * Headers:
     *   - x-user-id: required user identifier
     * Returns: 201 with created note
     */
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(400).json({ message: 'x-user-id header is required' });
      const { valid, errors } = validateNotePayload({ ...req.body, userId }, { partial: false });
      if (!valid) return res.status(400).json({ message: 'Validation failed', errors });
      const note = await notesService.createNote({ ...req.body, userId });
      return res.status(201).json(note);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /**
     * Update an existing note (title/content) for the requesting user.
     * Params:
     *   - id: note id
     * Body:
     *   - title?: string
     *   - content?: string
     * Headers:
     *   - x-user-id: required user identifier
     * Returns: 200 with updated note or 404 if not found
     */
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(400).json({ message: 'x-user-id header is required' });
      const { valid, errors } = validateNotePayload(req.body || {}, { partial: true });
      if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

      const { id } = req.params;
      const updated = await notesService.updateNote(userId, id, req.body || {});
      if (!updated) return res.status(404).json({ message: 'Note not found' });
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /**
     * Delete a note by id for the requesting user.
     * Params:
     *   - id: note id
     * Headers:
     *   - x-user-id: required user identifier
     * Returns: 204 on success, 404 if not found
     */
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(400).json({ message: 'x-user-id header is required' });
      const { id } = req.params;
      const ok = await notesService.deleteNote(userId, id);
      if (!ok) return res.status(404).json({ message: 'Note not found' });
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new NotesController();
