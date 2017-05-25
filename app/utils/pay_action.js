'use strict';

module.exports = (app, name) => {
  const { STRING, INTEGER, BIGINT, DOUBLE, TEXT } = app.Sequelize;
  const SEX_TAG = {
    UNKNOWN: 0,
    MALE: 1,
    FEMALE: 2,
  };

  const PayAction = app.model.define(`PayAction_${name}`, {
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
  });

  return PayAction;

};
