const path = require('path')

// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps: [{
    name: 'sub-games-companion',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: process.env.NODE_ENV !== 'production'
      ? [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'type-defs')]
      : false,
    // watch_options: {
    //   'usePolling': true
    // },
    max_memory_restart: '1G'
  }]
}
