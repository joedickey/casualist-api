const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 and json obj', () => {
    return supertest(app)
      .get('/api/*')
      .expect(200, '{"ok":true}')
  })
})