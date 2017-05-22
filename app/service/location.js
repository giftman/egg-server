'use strict';

// app/service/topics.js
module.exports = app => {
  class LocationService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.root = 'http://apis.map.qq.com/ws/geocoder/v1/?'
        + 'key=D2MBZ-GRNRU-WFFVT-4XKS7-GWQ55-RPFMJ&location=';
    }
    * create(dot) {
      // 调用 CNode V1 版本 API
      const result = yield this.ctx.curl(`${this.root}${dot}`, {
        method: 'get',
        dataType: 'json',
        contentType: 'json',
      });
      // 检查调用是否成功，如果调用失败会抛出异常
      this.checkSuccess(result);
      // 返回创建的 topic 的 id
      return result.data.result.address_component.city;
    }
    // 封装统一的调用检查函数，可以在查询、创建和更新等 service 中复用
    checkSuccess(result) {
      if (result.status !== 200) {
        const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
        this.ctx.throw(result.status, errorMsg);
      }
      // if (!result.data.success) {
      //   // 远程调用返回格式错误
      //   this.ctx.throw(500, 'remote response error', { data: result.data });
      // }
    }
  }
  return LocationService;
};
