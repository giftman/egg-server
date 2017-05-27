// app/middleware/error_handler.js
'use strict';
const SDKConfig = require('../utils/SDKConfig');

module.exports = () => {
  return function* gzip(next) {
    // 后续中间件执行完成后将响应体转换成 gzip
    // let body = this.body;
    // if (!body) return;
    // 支持 options.ththishold
    console.log(this.request.body);
    const { request } = this;
    if (request.body.data) {
      this.data = JSON.parse(request.body.data);
      // console.log(this.data.gameSimpleName);
      this.game_code = this.data.gameSimpleName;
      this.sdk_code = this.data.sdkSimpleName;
      this.sdk_version_name = this.data.sdkVersionCode;
    } else {
      this.data = request.query.data ? JSON.parse(request.query.data) : request.query;
    //   console.log(this.data);
    //   console.log(this.params);
      this.game_code = this.params.gameSimpleName;
      this.sdk_code = this.params.sdkSimpleName;
      this.sdk_version_name = this.params.sdkVersionCode;
    }
    const sdk_config = new SDKConfig();
    this.game_config = sdk_config.get_game_config(this.game_code);
    this.sdk_version_config = sdk_config.get_sdk_config(this.game_code, this.sdk_code, this.sdk_version_name);
    this.app_key = this.game_config['appKey'];
    this.serverConfig = this.sdk_version_config['serverConfig'];
    yield next;
    // this.set('Content-Encoding', 'gzip');
  };
};
