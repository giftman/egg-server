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
      if (!this.ctx.app.tables.includes(`pay_${info.gameSimpleName}`)) {
        yield PayAction.sync();
        this.ctx.app.tables.push(`pay_${info.gameSimpleName}`);
        this.ctx.app.model[info.gameSimpleName] = PayAction;
      }
      console.log(this.ctx.app.tables);
      const pay_action = yield PayAction.create(info);
      return pay_action;
    }

    * findPayAction(query_id) {
      console.log(this.ctx.game_code);
      console.log(query_id);
      const pay_action = this.ctx.helper.get_pay_action(this.app, this.ctx.game_code).findOne({
        where: {
          queryId: query_id,
        },
      });
      return pay_action;
    }

    * callback_to_game(pay_action) {
      // console.log(pay_action);
      pay_action.payStatus = 3;
      const callback_url = pay_action.payCallbackUrl;

      const post_parmgs = {};
      post_parmgs.serverId = pay_action.serverId;
      post_parmgs.playerId = pay_action.playerId;
      post_parmgs.orderId = pay_action.orderId;
      post_parmgs.postTime = pay_action.postTime;
      post_parmgs.payTime = pay_action.payTime;
      post_parmgs.payAmount = pay_action.payAmount;
      post_parmgs.currency = pay_action.currency;
      post_parmgs.goodsId = pay_action.productId;
      post_parmgs.goodsName = pay_action.productName;
      post_parmgs.remoteIp = pay_action.remoteIp;
      post_parmgs.custom = pay_action.custom;
      post_parmgs.queryId = pay_action.queryId;
      post_parmgs.uId = pay_action.uId;
      post_parmgs.gameSimpleName = pay_action.gameSimpleName;
      post_parmgs.sdkSimpleName = pay_action.sdkSimpleName;
      post_parmgs.serverSign = this.ctx.helper.md5(`
            serverId=${pay_action.serverId}
            &playerId=${pay_action.serverId}
            &orderId=${pay_action.playerId}
            &gameAppKey=${this.app_key}
      `);
      // console.log(post_parmgs);
      const result = yield this.ctx.curl('http://127.0.0.1:7001/call_back_to_game', {
        method: 'post',
        data: post_parmgs,
        dataType: 'json',
        contentType: 'json',
      });
      console.log(result.data);
      if (result.data && result.data.code === 1) {
        pay_action.payStatus = 4;
      } else {
        pay_action.payStatus = -3;
        pay_action.remark = result.data.message || 'call back to game fail';
      }
      yield pay_action.save();

      return pay_action;
    }
  }
  return PayService;
};
