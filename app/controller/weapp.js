'use strict';
module.exports = app => {
  class WeappController extends app.Controller {
    * index() {
      this.ctx.body = 'hi, egg';
    }

    * login() {
      const { ctx, app } = this;
      const loginService = app.weapp.LoginService.create(ctx.request, ctx.response);
      const data = yield loginService.login();
      const userInfo = data.userInfo;
      console.log(userInfo);
      const user = yield ctx.service.user.getOauthUser(userInfo, 'WEAPP');

      // const managers = yield ctx.model.models.school_managers.findAll({
      //   attributes: { exclude: ['createdAt', 'updatedAt'] },
      //   where: {
      //     userId: user.id,
      //   },
      // });
      data.userInfo = Object.assign({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        // inChargeOf: managers.map(item => item.schoolId),
      }, data.userInfo);
      ctx.body = data;
    }

    * user() {
      const { ctx } = this;
      const user = yield ctx.service.user.checkWeappUser();
      ctx.body = { code: 0, msg: 'ok', user };
    }

    * location() {
      // this.ctx.body = 'hi.location';
      const { ctx } = this;
      const city = yield ctx.service.location.create(ctx.query.p);
      ctx.body = { code: 0, message: 'ok', location: city };
    }
  }
  return WeappController;
};
