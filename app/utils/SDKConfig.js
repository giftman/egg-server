// var sdk_config = require('config.json') var request = require('request');

'use strict';

function SDKConfig() {
  this.sdk_config = require('./config.json');
    // this.sdk_config = new Proxy(this.sdk_config,handler)
  this.get_game_config = function(game_code) {
    return this.sdk_config[game_code];
  };

  this.get_sdk_config = function(game_code, sdk_code, sdk_version) {
    return this.sdk_config[game_code].sdk_list[sdk_code][sdk_version];
  };

}

module.exports = SDKConfig;
