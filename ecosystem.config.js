module.exports = {
  apps: [
    {
      name: 'imchat',
      script: './api/dist/index.js',
      cwd: './apps',
      instances: 'max',
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: '3000',
        NODE_ENV: 'production',
      },
    },
  ],
};
