module.exports = {
  apps: [
    {
      name: 'proper-ai-suite',
      script: 'npx',
      args: 'wrangler dev --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10
    }
  ]
}
