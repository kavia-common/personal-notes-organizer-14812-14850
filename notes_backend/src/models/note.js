'use strict';

const { randomUUID } = require('crypto');

// PUBLIC_INTERFACE
function createNote({ title, content, userId }) {
  /** Create a new Note object with defaults and generated id/timestamps. */
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    userId,
    title: title || '',
    content: content || '',
    createdAt: now,
    updatedAt: now,
  };
}

// PUBLIC_INTERFACE
function validateNotePayload(payload, { partial = false } = {}) {
  /**
   * Validate incoming payload for creating/updating a note.
   * If partial = false, title and content are required.
   * If partial = true, at least one of title/content must be present.
   */
  const errors = [];

  if (!partial) {
    if (!payload || typeof payload !== 'object') {
      errors.push('Payload must be an object.');
    } else {
      if (typeof payload.title !== 'string' || payload.title.trim() === '') {
        errors.push('title is required and must be a non-empty string.');
      }
      if (typeof payload.content !== 'string') {
        errors.push('content is required and must be a string.');
      }
      if (!payload.userId || typeof payload.userId !== 'string') {
        errors.push('userId is required and must be a string.');
      }
    }
  } else {
    if (!payload || typeof payload !== 'object') {
      errors.push('Payload must be an object.');
    } else {
      const hasUpdatable = ['title', 'content'].some((k) => Object.prototype.hasOwnProperty.call(payload, k));
      if (!hasUpdatable) {
        errors.push('At least one of title or content must be provided.');
      } else {
        if (payload.title !== undefined && (typeof payload.title !== 'string' || payload.title.trim() === '')) {
          errors.push('title must be a non-empty string when provided.');
        }
        if (payload.content !== undefined && typeof payload.content !== 'string') {
          errors.push('content must be a string when provided.');
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  createNote,
  validateNotePayload,
};
