'use strict';

module.exports = appInfo => {
  const config = {
    // 加载 errorHandler 中间件
    middleware: [ 'errorHandler' ],
    // 只对 /api 前缀的 url 路径生效
    errorHandler: {
      match: '/api',
    },
  };

  // should change to your own
  config.keys = appInfo.name + '_1494230402695_6475';
  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
    },
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'tftime',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: 'winfan123',
  };

  // replace your appId and appSecret of WEAPP
  config.weappSDK = {
    appId: 'wx5a86a487fb09ab5c',
    appSecret: '5ef3e3c042a89a75e26e823df7f41e23',
  };

  return config;
};

