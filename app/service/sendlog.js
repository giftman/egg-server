'use strict';

module.exports = app => {
  class LogService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }

    * send(action, data, data_str) {
      // console.log(post_parmgs);
      const post_data = Object.assign({}, data);
      post_data.data = data_str;
      post_data.action = action;
      const currentTime = parseInt(Date.now() / 1000);
      post_data.t = currentTime;
      post_data.ta = 'default';
    //   post_data.sign = `action=${action}data=${data}t=${currentTime}ta=default${this.config.STATISTIC_SIGN_KEY}`;
    //   this.logger.info(post_data);
      post_data.sign = this.ctx.helper.make_sign(post_data, this.config.STATISTIC_SIGN_KEY);
      try {
        yield this.ctx.curl(this.config.STATISTIC_ADDRESS, {
          method: 'get',
          data: post_data,
          dataType: 'json',
          contentType: 'json',
        });
        // console.log(result);
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  return LogService;
};
