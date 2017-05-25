'use strict';

// had enabled by egg
// exports.static = true;
// config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.redis = {
  enable: false,
  package: 'egg-redis',
};

exports.weappSDK = {
  enable: false,
  package: 'egg-weapp-sdk',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
