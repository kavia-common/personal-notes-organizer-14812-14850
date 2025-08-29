'use strict';

const fs = require('fs');
const path = require('path');

// Ensure directory exists
function ensureDirExists(targetPath) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// PUBLIC_INTERFACE
class FileStore {
  /** Simple JSON file based persistence for notes. Not for production use. */
  constructor(filePath) {
    this.filePath = filePath;
    ensureDirExists(this.filePath);
    // Initialize file if not exists
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ notes: [] }, null, 2));
    }
  }

  _read() {
    const raw = fs.readFileSync(this.filePath, 'utf8');
    try {
      return JSON.parse(raw);
    } catch (e) {
      // If corrupted, reset to empty structure
      return { notes: [] };
    }
  }

  _write(data) {
    ensureDirExists(this.filePath);
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // PUBLIC_INTERFACE
  getAll() {
    /** Return all note objects stored. */
    const data = this._read();
    return data.notes || [];
  }

  // PUBLIC_INTERFACE
  getById(id) {
    /** Return a single note by id or null if not found. */
    const data = this._read();
    return (data.notes || []).find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  create(note) {
    /** Persist a new note and return it. */
    const data = this._read();
    data.notes = data.notes || [];
    data.notes.push(note);
    this._write(data);
    return note;
  }

  // PUBLIC_INTERFACE
  update(id, patch) {
    /** Update a note by id with provided fields. Returns updated note or null. */
    const data = this._read();
    const idx = (data.notes || []).findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const updated = { ...data.notes[idx], ...patch, updatedAt: new Date().toISOString() };
    data.notes[idx] = updated;
    this._write(data);
    return updated;
  }

  // PUBLIC_INTERFACE
  remove(id) {
    /** Remove a note by id. Returns true if removed, false otherwise. */
    const data = this._read();
    const before = data.notes.length;
    data.notes = data.notes.filter((n) => n.id !== id);
    this._write(data);
    return data.notes.length < before;
  }
}

module.exports = FileStore;
