const path = require('path')

// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [
    {
      name: 'sub-games-companion-api',
      script: 'dist/api/index.js',
      instances: 1,
      autorestart: true,
      watch: process.env.NODE_ENV !== 'production'
        ? [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'type-defs', 'api')]
        : false,
      max_memory_restart: '1G'
    }
  ]
}
