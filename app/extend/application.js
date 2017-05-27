'use strict';

const MODULE = Symbol('Application#module');
const path = require('path');
// app/extend/context.js
module.exports = {
  get sdk_module() {
    if (!this[MODULE]) {
      loadModel(this);
    }
    return this[MODULE];
  },
};

function loadModel(app) {
  const modelDir = path.join(app.baseDir, 'app/sdks');
  app.loader.loadToApp(modelDir, MODULE, {
    inject: app,
    caseStyle: 'camel',
    ignore: 'index.js',
  });
//   app.sdk_module = {};
// //   console.log(app[MODULE]);
//   for (const name of Object.keys(app[MODULE])) {
//     console.log(name);
//     const instance = app[MODULE][name];
//     // only this Sequelize Model class
//     if (!(instance instanceof app.Sequelize.Model)) {
//       continue;
//     }
//     app.sdk_module[name] = instance;
//   }
}
