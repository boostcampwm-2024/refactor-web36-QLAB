module.exports = {
  apps: [
    {
      name: 'nest-server',
      script: 'dist/main.js', // NestJS 서버의 진입 파일
      instances: 1, 
      exec_mode: 'fork', 
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
