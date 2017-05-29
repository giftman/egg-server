'use strict';

module.exports = app => {
  const unpack = app.middlewares.unpack({ threshold: 1024 });
  app.get('/', 'home.index');
  app.post('/logincheck/check', unpack, 'sdk.login');
  app.get('/logincheck', unpack, 'sdk.login');
  app.get('/paycheck/create/:gameSimpleName/:sdkSimpleName/:sdkVersionCode', unpack, 'sdk.create');
  app.get('/paycheck', unpack, 'sdk.create');
  app.post('/update_config', 'sdk.update');
};
