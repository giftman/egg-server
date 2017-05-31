'use strict';

exports.login = function* (ctx, login_data, login_config = {}) {
  const app_server_key = login_config.appKey || '';

  const openid = login_data.openId || '';
  const t = login_data.timestamp;
  const sign = login_data.sign;

  const sign_str = `${openid}&${t}&${app_server_key}`;
  console.log(sign_str);
  const my_sign = ctx.helper.md5(sign_str);
  console.log(my_sign);
//   const result = yield ctx.curl('http://www.baidu.com');
  let open_id,
    message;
  let code = 1;
  try {
    if (sign === my_sign) {
      open_id = openid;
      code = 0;
      message = 'success';
    } else {
      console.log(sign_str);
      message = 'sign error';
    }
  } catch (error) {
    message = error.toString();
  }
  return { code, message, open_id };
};

exports.create = function* (login_data, login_config = {}) {
  console.log('create');
  return 'create';
    // return {code,message,open_id}
};

exports.confirm = function* (ctx, server_config = {}) {
  const serverId = ctx.query.serverId || '';
  const callbackInfo = ctx.query.callbackInfo || '';
  const openId = ctx.query.openId || '';
  const orderId = ctx.query.orderId || '';
  const orderStatus = ctx.query.orderStatus || '';
  let amount = ctx.query.amount || '';
  let remark = ctx.query.remark || '';
  let sign = ctx.query.sign || '';
  const payType = ctx.query.payType || '';

  const app_server_key = server_config.appKey || '';
  const rate = server_config.amount_rate || '';

  let order_id,
    query_id,
    result_msg = '';
  let sign_str = [ serverId, callbackInfo, openId, orderId, orderStatus, payType, amount, remark, app_server_key ].join('');
  sign_str = ctx.helper.md5(sign_str);
  sign = sign_str;
  if (sign_str === sign) {
    order_id = orderId;
    query_id = callbackInfo;
    amount = parseFloat(amount) / rate;
    result_msg = 'success';
    remark = orderStatus;
  } else {
    result_msg = 'fail';
  }
  return {
    query_id,
    order_id,
    amount,
    remark,
    result_msg,
  };
};
