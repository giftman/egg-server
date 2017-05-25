'use strict';

module.exports = app => {
  class PayService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }

    * createPay(info) {
      yield this.models.PayAction.sync();
      const pay_action = yield this.models.PayAction.create(info);
      return pay_action;
    }

  }
  return PayService;
};
