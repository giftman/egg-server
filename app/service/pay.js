'use strict';

module.exports = app => {
  class PayService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }

    * createPay(info) {
      // yield this.models.PayAction.sync();
      const PayAction = this.ctx.helper.get_pay_action(this.app, info.gameSimpleName);
      yield PayAction.sync();
      const pay_action = yield PayAction.create(info);
      return pay_action;
    }

  }
  return PayService;
};
