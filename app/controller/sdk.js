'use strict';
var platforms = require('../sdks');


module.exports = app => {
  class SDKController extends app.Controller {
    * index() {
      this.ctx.body = 'hi, egg';
    }
    * init(){
        ctx.logger.info('init')
    }
    * login() {
        const {ctx} = this;
        ctx.logger.info(ctx.sdk_version_name)
        ctx.logger.info(ctx.request.headers)
        let _r = {
            "code": 1,
            "userType": 0,
            "openId": "",
            "timestamp": "",
            "message": "",
            "other": ""
        }

        var login_data = platforms[ctx.sdk_code][ctx.sdk_version_name].login(ctx.data, ctx.serverConfig);
        var {code, message, open_id} = login_data
        ctx.logger.info(message)
        _r['timestamp'] = ctx.data.timestamp || new Date().getTime()
        _r['openId'] = open_id
        _r['t'] = new Date().getTime()
        _r['userType'] = ctx.sdk_version_config.userType || 0
        _r['other'] = login_data.other || ''
        var sign_str = ''
        if (code === 0) {
            sign_str = `gameAppkey=${ctx.app_key}&userType=${_r.userType}&openId=${open_id}&timestamp=${_r.timestamp}`
            ctx.logger.info(sign_str)
            _r['serverSign'] = ctx.helper.md5(sign_str)
            _r['remoteIp'] = ctx.request.host || ''
            _r['code'] = 1
        }
        _r['message'] = message
        ctx.logger.info(_r)
        this.ctx.body = _r;
    }

    * create() {
        let _r = {
            "code": -1,
            "message": "",
            "data": {}
        }
        const {ctx} = this;
        ctx.logger.info(ctx.isIOS);
        var pay_params = {}
        pay_params.gameSimpleName = ctx.game_code
        pay_params.sdkSimpleName = ctx.sdk_code

        pay_params.serverId = ctx.data.serverId||''
        pay_params.playerId = ctx.data.playerId||''
        pay_params.postAmount = ctx.data.postAmount||''
        pay_params.productId = ctx.data.productId||''
        pay_params.custom = ctx.data.custom||''
        pay_params.uId = ctx.data.userId||''
        pay_params.currency = ctx.data.currency||'CNY'
        pay_params.productName = ctx.data.productName||''
        if (pay_params.serverId && pay_params.playerId && pay_params.postAmount){
            ctx.logger.info('create')
            pay_params.queryId = ctx.helper.uuid()
            pay_params.remoteIp = ctx.request.host || '';
            pay_params.postTime = new Date().getTime()
            pay_params.orderId = ''
            pay_params.payTime = 0
            pay_params.payAmount = 0
            pay_params.productAmount = 0
            pay_params.remark = 'create order'
            pay_params.payStatus = 0

            pay_params.other = platforms[ctx.sdk_code][ctx.sdk_version_name].create(ctx,ctx.serverConfig); 

            ctx.logger.info(pay_params)
            const create_order_result = yield ctx.service.pay.createPay(pay_params);

            //callback to client
            if(create_order_result){
                 var itemConfig = ctx.sdk_version_config.itemConfig || ''
                var isOpenThirdPay = ctx.serverConfig.isOpenThirdPay || 'false'
                _r['data']['queryId'] = pay_params.queryId
                _r['data']['other'] = pay_params.other
                _r['data']['products'] = itemConfig
                _r['data']['isOpenThirdPay'] = isOpenThirdPay
                _r['data']['serverId'] = pay_params.serverId
                _r['data']['playerId'] = pay_params.playerId
                _r['data']['postTime'] = pay_params.postTime
                _r['data']['postAmount'] = pay_params.postAmount
                _r['data']['productId'] = pay_params.productId
                _r['data']['currency'] = pay_params.currency
                _r['data']['custom'] = pay_params.custom
                _r['data']['gameSimpleName'] = pay_params.gameSimpleName
                _r['data']['sdkSimpleName'] = pay_params.sdkSimpleName
                _r['data']['uId'] = pay_params.uId
                _r['data']['remoteIp'] = pay_params.remoteIp
                _r['code'] = 1
                ctx.body = _r;
            }
        }else{
            ctx.body = _r;
        }
    }

    * confirm() {
        this.ctx.body = 'hi, confirm';
    }
  }
  return SDKController;
};
