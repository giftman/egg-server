'use strict';

// app/service/topics.js
const fs = require('fs');
const path = require('path');
module.exports = app => {
  class SdkModuleService extends app.Service {
    constructor(ctx, sdk_code, sdk_version) {
      super(ctx);
      this.sdk_code = sdk_code;
      this.sdk_version = sdk_version;
      this.module_name = `${sdk_code}${sdk_version}`;
      const { the_module_file_name, the_abs_module_path } = this._get_module_file();
      this.the_module_file_name = the_module_file_name;
      this.the_abs_module_path = the_abs_module_path;
    }
    * create(params) {
      // 调用 CNode V1 版本 API
      const result = yield this.ctx.curl(`${this.root}/topics`, {
        method: 'post',
        data: params,
        dataType: 'json',
        contentType: 'json',
      });
      // 检查调用是否成功，如果调用失败会抛出异常
      this.checkSuccess(result);
      // 返回创建的 topic 的 id
      return result.data.topic_id;
    }
    _get_module_file(){
        the_module_file_name = `${this.sdk_version}.js`
        const the_module_dir = path.join(app.baseDir, `app/sdks${this.sdk_code}`);
        this.__create_module_dir(the_module_dir)
        the_abs_module_path = path.join(the_module_dir,the_module_file_name)
        return {the_module_file_name,the_abs_module_path}
    }
    _create_module_dir(the_module_dir){
        try {
            if(!fs.exists(the_module_dir)){
                fs.mkdir(the_module_dir,'0755');
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
    load_module(){
      let module = null;
      if (!fs.exists(this.the_abs_module_path)) {

      }
    }
  }
  return SdkModuleService;
};
