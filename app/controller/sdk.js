'use strict';
var platforms = require('../sdks');
var md5 = require('../utils/md5')


function create_query_id(){
  var data_now = new Date()
  var random_str = Math.random().toString(36).substring(6).toUpperCase();
  console.log(random_str)
  return `${data_now.getFullYear()}${data_now.getMonth()}${data_now.getDay()}${data_now.getHours()}${data_now.getMinutes()}${data_now.getSeconds()}${random_str}`
}

module.exports = app => {
  class SDKController extends app.Controller {
    * index() {
      this.ctx.body = 'hi, egg';
    }
    * init(){
        console.log('init')
    }
    * login() {
        const {ctx} = this;
        console.log(ctx.sdk_version_name)
        console.log(ctx.request.headers)
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
        console.log(message)
        _r['timestamp'] = ctx.data.timestamp || new Date().getTime()
        _r['openId'] = open_id
        _r['t'] = new Date().getTime()
        _r['userType'] = ctx.sdk_version_config.userType || 0
        _r['other'] = login_data.other || ''
        var sign_str = ''
        if (code === 0) {
            sign_str = `gameAppkey=${ctx.app_key}&userType=${_r.userType}&openId=${open_id}&timestamp=${_r.timestamp}`
            console.log(sign_str)
            _r['serverSign'] = md5(sign_str)
            _r['remoteIp'] = ctx.request.host || ''
            _r['code'] = 1
        }
        _r['message'] = message
        console.log(_r)
        this.ctx.body = _r;
    }

    * create() {
        let _r = {
            "code": -1,
            "message": "",
            "data": {}
        }
        const {ctx} = this;
        console.log(ctx.isIOS);
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
            console.log('create')
            pay_params.queryId = create_query_id()
            pay_params.remoteIp = ctx.request.host || '';
            pay_params.postTime = new Date().getTime()
            pay_params.orderId = ''
            pay_params.payTime = 0
            pay_params.payAmount = 0
            pay_params.productAmount = 0
            pay_params.remark = 'create order'
            pay_params.payStatus = 0

            pay_params.other = platforms[ctx.sdk_code][ctx.sdk_version_name].create(ctx,ctx.serverConfig); 

            console.log(pay_params)
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
