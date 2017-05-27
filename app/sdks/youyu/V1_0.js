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

exports.confirm = function* (login_data, login_config = {}) {
  console.log('confirm');
  return 'confirm';
};
