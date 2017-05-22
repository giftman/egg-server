'use strict';

const request = require('supertest');
const mock = require('egg-mock');
describe('test/app/controller/topics.test.js', () => {
  let app;
  before(() => {
    // 通过 egg-mock 库快速创建一个应用实例
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);
  // 测试请求参数错误时应用的响应
  it('should POST /api/v2/topics/ 422', function* () {
    app.mockCsrf();
    yield request(app.callback())
    .post('/api/v2/topics')
    .send({
      accesstoken: '123',
    })
    .expect(422)
    .expect({
      error: 'Validation Failed',
      detail: [{ message: 'required', field: 'title', code: 'missing_field' }, { message: 'required', field: 'content', code: 'missing_field' }],
    });
  });
  // mock 掉 service 层，测试正常时的返回
  it('should POST /api/v2/topics/ 201', function* () {
    app.mockCsrf();
    app.mockService('topics', 'create', 123);
    yield request(app.callback())
    .post('/api/v2/topics')
    .send({
      accesstoken: '123',
      title: 'title',
      content: 'hello',
    })
    .expect(201)
    .expect({
      topic_id: 123,
    });
  });
});
