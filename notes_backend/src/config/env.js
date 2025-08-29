'use strict';

/**
 * Loads and exposes environment configuration for the application.
 * Uses dotenv to load environment variables from a .env file (if present).
 * PUBLIC_INTERFACE
 * getConfig returns a frozen object with all config values.
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env if it exists at project root of notes_backend
const envPath = path.resolve(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Fallback to default dotenv behavior (search up the tree)
  dotenv.config();
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
  // Database configuration - for demo, a file-based storage path is used by default.
  // If NOTES_DB_URL is provided, it can be used by a different storage adapter.
  notesDbUrl: process.env.NOTES_DB_URL || '',
  storageFilePath:
    process.env.NOTES_STORAGE_FILE ||
    path.resolve(__dirname, '..', '..', 'data', 'notes.json'),
};

Object.freeze(config);

// PUBLIC_INTERFACE
function getConfig() {
  /** Returns application configuration loaded from environment variables. */
  return config;
}

module.exports = {
  getConfig,
};
