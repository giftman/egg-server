'use strict';
const fs = require('../utils/fs');
const path = require('path');

module.exports = app => {
  class SDKController extends app.Controller {
    * index() {
      this.ctx.body = 'hi, egg';
    }
    * update() {
    //   ctx.logger.info('init');
      const { ctx } = this;
      console.log(ctx.request.body.data);
      const new_config = ctx.request.body.data;
      const the_file_dir = path.join(ctx.app.baseDir, 'app/utils/config.json');
      const result = yield fs.writeFile(the_file_dir, new_config);
      if (result) {
        ctx.app.update_sdk_config();
        ctx.body = 'update success';
      } else {
        ctx.body = 'update failure';
      }

    }
    * login() {
      const { ctx } = this;
        // ctx.logger.info(ctx.sdk_version_name)
        // ctx.logger.info(ctx.request.headers)
      const _r = {
        code: 1,
        userType: 0,
        openId: '',
        timestamp: '',
        message: '',
        other: '',
      };
      const login_data = yield app.sdk_module[ctx.sdk_code][ctx.sdk_version_name].login(ctx, ctx.data, ctx.serverConfig);
      const { code, message, open_id } = login_data;
        // ctx.logger.info(message)
      _r.timestamp = ctx.data.timestamp || new Date().getTime();
      _r.openId = open_id;
      _r.t = new Date().getTime();
      _r.userType = ctx.sdk_version_config.userType || 0;
      _r.other = login_data.other || '';
      let sign_str = '';
      if (code === 0) {
        sign_str = `gameAppkey=${ctx.app_key}&userType=${_r.userType}&openId=${open_id}&timestamp=${_r.timestamp}`;
        ctx.logger.info(sign_str);
        _r.serverSign = ctx.helper.md5(sign_str);
        _r.remoteIp = ctx.ip || '';
        _r.code = 1;
      }
      _r.message = message;
      ctx.logger.info(_r);
      this.ctx.body = _r;
    }

    * create() {
      const _r = {
        code: -1,
        message: '',
        data: {},
      };
      const { ctx } = this;
        // ctx.logger.info(ctx.isIOS);
      const pay_params = {};
      pay_params.gameSimpleName = ctx.game_code;
      pay_params.sdkSimpleName = ctx.sdk_code;

      pay_params.serverId = ctx.data.serverId || '';
      pay_params.playerId = ctx.data.playerId || '';
      pay_params.postAmount = ctx.data.postAmount || '';
      pay_params.productId = ctx.data.productId || '';
      pay_params.custom = ctx.data.custom || '';
      pay_params.uId = ctx.data.userId || '';
      pay_params.currency = ctx.data.currency || 'CNY';
      pay_params.productName = ctx.data.productName || '';
      if (pay_params.serverId && pay_params.playerId && pay_params.postAmount) {
            // ctx.logger.info('create')
        pay_params.queryId = ctx.helper.uuid();
        pay_params.remoteIp = ctx.ip || '';
        pay_params.postTime = new Date().getTime();
        pay_params.orderId = '';
        pay_params.payTime = 0;
        pay_params.payAmount = 0;
        pay_params.productAmount = 0;
        pay_params.remark = 'create order';
        pay_params.payStatus = 0;

            // console.log(app.sdk_module);
        pay_params.other = yield app.sdk_module[ctx.sdk_code][ctx.sdk_version_name].create(ctx, ctx.serverConfig);

        ctx.logger.info(pay_params);
        const create_order_result = yield ctx.service.pay.createPay(pay_params);

            // callback to client
        if (create_order_result) {
          const itemConfig = ctx.sdk_version_config.itemConfig || '';
          const isOpenThirdPay = ctx.serverConfig.isOpenThirdPay || 'false';
          _r.data.queryId = pay_params.queryId;
          _r.data.other = pay_params.other;
          _r.data.products = itemConfig;
          _r.data.isOpenThirdPay = isOpenThirdPay;
          _r.data.serverId = pay_params.serverId;
          _r.data.playerId = pay_params.playerId;
          _r.data.postTime = pay_params.postTime;
          _r.data.postAmount = pay_params.postAmount;
          _r.data.productId = pay_params.productId;
          _r.data.currency = pay_params.currency;
          _r.data.custom = pay_params.custom;
          _r.data.gameSimpleName = pay_params.gameSimpleName;
          _r.data.sdkSimpleName = pay_params.sdkSimpleName;
          _r.data.uId = pay_params.uId;
          _r.data.remoteIp = pay_params.remoteIp;
          _r.code = 1;
          ctx.body = _r;
        }
      } else {
        ctx.body = _r;
      }
    }

    * confirm() {
      const { ctx } = this;
      const result = yield app.sdk_module[ctx.sdk_code][ctx.sdk_version_name].confirm(ctx, ctx.serverConfig);
      let { query_id, amount, result_msg, product_id } = result;
      if (query_id) {
        let pay_action = yield ctx.service.pay.findPayAction(query_id);
        pay_action.payAmount = parseFloat(amount);
        pay_action.remark = result.remark || '';
        pay_action.payTime = new Date().getTime();
        pay_action = yield ctx.service.pay.callback_to_game(pay_action);
        if (pay_action.payStatus !== 4) {
          result_msg = `${query_id} call back to game error`;
        }

      } else {
        result_msg = 'not query_id';
      }
      this.ctx.body = result_msg;
    }

    * callBackToGame() {
      console.log(this.ctx.request.body);
      this.ctx.body = { code: 1, message: 'success' };
    }
  }
  return SDKController;
};
