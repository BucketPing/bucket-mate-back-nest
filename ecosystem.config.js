module.exports = {
  apps: [
    {
      name: 'bucket-mate',
      script: './dist/src/main.js', // 실행할 파일
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
