'use strict';

const MODULE = Symbol('Application#module');
const SDK_CONFIG = Symbol('Application#config');
const path = require('path');
const fs = require('../utils/fs');
// app/extend/context.js
module.exports = {
  get sdk_module() {
    if (!this[MODULE]) {
      loadModel(this);
    }
    return this[MODULE];
  },
  get sdk_config() {
    if (!this[SDK_CONFIG]) {
      loadSdkConfig(this);
    }
    return this[SDK_CONFIG];
  },
  get_game_config(game_code) {
    return this.sdk_config[game_code];
  },
  get_sdk_config(game_code, sdk_code, sdk_version) {
    return this.sdk_config[game_code].sdk_list[sdk_code][sdk_version];
  },
  update_sdk_config() {
    console.log('update_sdk_config');
    this[SDK_CONFIG] = null;
  },
  // 可以直接 把* function 写到这里来
  * update_module(sdk_code, sdk_version) {
    const the_module_file_name = `${sdk_version}.js`;
    const the_module_dir = path.join(this.baseDir, `app/sdks/${sdk_code}`);
    __create_module_dir(the_module_dir);
    const the_abs_module_path = path.join(the_module_dir, the_module_file_name);
    const file_stat = yield fs.stat(the_abs_module_path);
    if (file_stat && file_stat.mtime) {
      console.log('exit');
    }
  },
};

function loadSdkConfig(app) {
  const path = '../utils/config.json';
  cleanCache(path);
  app[SDK_CONFIG] = require(path);
}

function cleanCache(module) {
  const path = require.resolve(module);
  require.cache[path] = null;
}

function loadModel(app) {
  const modelDir = path.join(app.baseDir, 'app/sdks');
  app.loader.loadToApp(modelDir, MODULE, {
    inject: app,
    caseStyle: 'camel',
    ignore: 'index.js',
  });
}

function __create_module_dir(the_module_dir) {
  if (!fs.exists(the_module_dir)) {
    fs.mkdir(the_module_dir, '0755');
  }
}
