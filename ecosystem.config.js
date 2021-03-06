module.exports = {
  apps : [{
    name: "reddit-clone",
    script: 'serve',
    watch: '.',
    env: {
      PM2_SERVE_PATH: 'build',
      PM2_SERVE_PORT: 55000,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
      NODE_ENV : "production"
    }
  },
  {
    name: "reddit-api",
    cwd: "./src/reddit-api-server",
    script: "npm",
    args: "start",
    watch: '.',
    env: {
      PORT: 55050,
      NODE_ENV : "production"
    }
  }

],
};
