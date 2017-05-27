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
  host: '10.66.215.210',
  port: '3306',
  username: 'tftime',
  password: 'winfan123',
};

