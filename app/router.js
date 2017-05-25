'use strict';

module.exports = app => {
  const gzip = app.middlewares.unpack({ threshold: 1024 });
  app.get('/', 'home.index');
  app.post('/logincheck/check', gzip,'sdk.login');
  app.get('/logincheck', gzip,'sdk.login');
  app.get('/paycheck/create/:gameSimpleName/:sdkSimpleName/:sdkVersionCode', gzip,'sdk.create');
  app.get('/paycheck', gzip,'sdk.create');
};
