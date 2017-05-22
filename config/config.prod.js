'use strict';

exports.redis = {
  client: {
    host: 'redis',
    port: '6379',
    password: '',
    db: '0',
  },
};

exports.sequelize = {
  dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
  database: 'tftime',
  host: 'mysql',
  port: '3306',
  username: 'root',
  password: 'winfan123',
};

