const app = require('./app');
const { getConfig } = require('./config/env');

/**
 * Server entry point. Respects environment variables:
 *  - PORT: HTTP port to listen on
 *  - HOST: Bind address
 */
const { port: PORT, host: HOST, nodeEnv } = getConfig();

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT} (env: ${nodeEnv})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
