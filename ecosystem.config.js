module.exports = {
  apps : [{
    name: "reddit-clone",
    script: 'serve',
    watch: '.',
    env: {
      PM2_SERVE_PATH: 'build',
      PM2_SERVE_PORT: 55001,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    }
  },
  {
    name: "reddit-api",
    cwd: "./src/reddit-api-server",
    script: "npm",
    args: "start",
    watch: '.',
    env: {
      NODE_ENV : "production"
    }
  }

],
};
