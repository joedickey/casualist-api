const app = require('../src/app')
const supertest = require('supertest')
const listsRouter = require('../src/lists/lists-router')
const { expect } = require('chai')
const { API_TOKEN } = require('../src/config')

describe('listsRouter', () => {

  it('GET /api/lists/:list_id responds with 200 and "Successful GET of list: :list_id"', () => {
    const testId = '12345'

    return supertest(app)
      .get(`/api/lists/${testId}`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(200, `Successful GET of list: ${testId}`)
  })

  it('PATCH /api/lists/:list_id responds with 204', () => {
    const testId = '12345'

    return supertest(app)
      .patch(`/api/lists/${testId}`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(204)
  })

  it('DELETE /api/lists/:list_id responds with 204', () => {
    const testId = '12345'

    return supertest(app)
      .delete(`/api/lists/${testId}`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(204)
  })

  it('POST /api/lists/ responds with 201 and "Successful POST"', () => {

    return supertest(app)
      .post(`/api/lists`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(201, `Successful POST`)
  })
})

describe('itemsRouter', () => {

  it('PATCH /api/items/:item_id responds with 204', () => {
    const testId = '12345'

    return supertest(app)
      .patch(`/api/items/${testId}`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(204)
  })

  it('DELETE /api/items/:item_id responds with 204', () => {
    const testId = '12345'

    return supertest(app)
      .delete(`/api/items/${testId}`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(204)
  })

  it('POST /api/lists/ responds with 201 and "Successful POST"', () => {

    return supertest(app)
      .post(`/api/items`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .expect(201, `Successful POST`)
  })
})