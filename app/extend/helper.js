'use strict';

// app/extend/context.js
module.exports = {
  md5(text) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
  },
  make_sign(_d, key) {
    const sign_list = [];
    // console.log(_d);
    for (const k of Object.keys(_d).sort()) {
      // console.log(k);
      if (k === 'sign') {
        continue;
      }
      const v = _d[k];
      sign_list.push(`${k}=${v}`);
    }
    let sign_str = sign_list.join('');
    sign_str = sign_str + key;
    // console.log(sign_str);
    return this.md5(sign_str);
  },
  get currentTime() {
    return parseInt(Date.now() / 1000);
  },
  uuid() {
    const t = new Date();
    const random_str = Math.random().toString(32).substring(6)
    .toUpperCase();
    return `${t.getFullYear()}${t.getMonth() + 1}${t.getDate()}${t.getHours()}${t.getMinutes()}${t.getSeconds()}${t.getMilliseconds()}${random_str}`;
  },
  get_pay_action(app, name) {
    const { STRING, INTEGER, BIGINT, DOUBLE, TEXT } = app.Sequelize;
    const SEX_TAG = {
      UNKNOWN: 0,
      MALE: 1,
      FEMALE: 2,
    };

    const PayAction = app.model.define(`pay_${name}`, {
      sex: {
        type: INTEGER,
        defaultValue: SEX_TAG.UNKNOWN,
      },
      queryId: STRING(40),
      orderId: STRING(50),
      gameSimpleName: STRING(40),
      sdkSimpleName: STRING(50),
      serverId: STRING(10),
      playerId: STRING(50),
      remoteIp: STRING(30),
      payStatus: INTEGER(11),
      postTime: BIGINT,
      payTime: BIGINT,
      postAmount: DOUBLE,
      payAmount: DOUBLE,
      productName: STRING(50),
      productAmount: DOUBLE,
      currency: STRING(50),
      custom: STRING(512),
      payCallbackUrl: STRING(512),
      uId: STRING(100),
      remark: STRING(512),
      other: TEXT,
      post_params: TEXT,
    },
      {
        freezeTableName: true,
        charset: 'utf8', // Model tableName will be the same as the model name
      });

    return PayAction;
  },
};
