const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const supertest = require('supertest')
const listsRouter = require('../src/lists/lists-router')
const { expect } = require('chai')
const { API_TOKEN } = require('../src/config')

describe('Lists Endpoints', () => {
  let db
  
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE lists RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE lists RESTART IDENTITY CASCADE'))

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

  it.only('POST /api/lists/ responds with 201 and json object', () => {
    const newList = {
      "url_path": "fgxbEp",
      "name": "My List",
      "item_order": [1, 2, 3, 4]
    }

    return supertest(app)
      .post(`/api/lists`)
      .set('Authorization', `Bearer ${API_TOKEN}` )
      .send(newList)
      .expect(201)
      .expect(res => {
        expect(res.body.url_path).to.eql(newList.url_path)
        expect(res.body.name).to.eql(newList.name)
        expect(res.body.item_order).to.eql(newList.item_order)
        expect(res.body).to.have.property('id')
      })
  })
})

describe('Items Endpoints', () => {

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