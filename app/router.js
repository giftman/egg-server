'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.resources('topics', '/api/v2/topics', 'topics');
  app.get('/login', 'weapp.login');
  app.get('/user', 'weapp.user');
  app.get('/location', 'weapp.location');
};
