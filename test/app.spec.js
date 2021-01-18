const app = require('../src/app');
const knex = require('knex');
require('dotenv').config();
const supertest = require('supertest');
const listsRouter = require('../src/lists/lists-router');
const { expect } = require('chai');
const { API_TOKEN } = require('../src/config');

describe('Lists Endpoints', () => {
    let db;

    const testList = {
        "url_path": "test",
        "name": "My List",
        "item_order": [1, 2, 3, 4]
    };

    const testItem = {
        "list_id": 1,
        "name": "Test Item",
        "assign": "Me",
        "notes": "Test Test Test"
    };

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE lists RESTART IDENTITY CASCADE'));

    beforeEach('insert list', () => {
        return db
            .into('lists')
            .insert(testList);
    });

    beforeEach('insert item', () => {
        return db
            .into('items')
            .insert(testItem);
    });

    afterEach('cleanup',() => db.raw('TRUNCATE lists RESTART IDENTITY CASCADE'));

    it('GET /api/lists/:url_path responds with 200 and json object', () => {
        const testUrl = 'test';

        return supertest(app)
            .get(`/api/lists/${testUrl}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .expect(200)
            .expect(res => {
                expect(res.body.url_path).to.eql(testList.url_path);
                expect(res.body.name).to.eql(testList.name);
                expect(res.body.item_order).to.eql(testList.item_order);
                expect(res.body).to.have.property('id');
            });
    });

    it('GET api/lists/listitems/:list_id responds 200 and items array', () => {
        const testId = 1;

        return supertest(app)
            .get(`/api/lists/listitems/${testId}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .expect(200)
            .expect(res => {
                expect(res.body[0].list_id).to.eql(testItem.list_id);
                expect(res.body[0].name).to.eql(testItem.name);
                expect(res.body[0].assign).to.eql(testItem.assign);
                expect(res.body[0].notes).to.eql(testItem.notes);
                expect(res.body[0]).to.have.property('id');
                expect(res.body[0]).to.have.property('status');
            });
    });

    it('PATCH /api/lists/:url_path responds with 204', () => {
        const testUrl = 'test';
        const listUpdate = {
            "name": "Update List",
            "item_order": [4, 3, 2, 1]
        };

        return supertest(app)
            .patch(`/api/lists/${testUrl}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .send(listUpdate)
            .expect(204);
    });

    it('DELETE /api/lists/:url_path responds with 400', () => {
        const testUrl = 'test';

        return supertest(app)
            .delete(`/api/lists/${testUrl}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .expect(400, '{"error":{"message":"Cannot delete list because of associated items."}}');
    });

    it('POST /api/lists/ responds with 201 and json object', () => {
        const newList = {
            "url_path": "fgxbEp",
            "name": "My List",
            "item_order": [1, 2, 3, 4]
        };

        return supertest(app)
            .post(`/api/lists`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .send(newList)
            .expect(201)
            .expect(res => {
                expect(res.body.url_path).to.eql(newList.url_path);
                expect(res.body.name).to.eql(newList.name);
                expect(res.body.item_order).to.eql(newList.item_order);
                expect(res.body).to.have.property('id');
            });
    });
});



describe('Items Endpoints', () => {
    let db;

    const testItem = {
        "list_id": 1,
        "name": "Test Item",
        "assign": "Me",
        "notes": "Test Test Test"
    };

    const testList = {
        "url_path": "test",
        "name": "My List",
        "item_order": [1, 2, 3, 4]
    };
  
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE items RESTART IDENTITY CASCADE'));

    beforeEach('insert list', () => {
        return db
            .into('lists')
            .insert(testList);
    });

    beforeEach('insert item', () => {
        return db
            .into('items')
            .insert(testItem);
    });

    afterEach('cleanup',() => db.raw('TRUNCATE items RESTART IDENTITY CASCADE'));
  
    it('GET /api/items/:item_id responds with 200 and json object', () => {
        const testId = 1;

        return supertest(app)
            .get(`/api/items/${testId}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .expect(200)
            .expect(res => {
                expect(res.body.list_id).to.eql(testItem.list_id);
                expect(res.body.name).to.eql(testItem.name);
                expect(res.body.assign).to.eql(testItem.assign);
                expect(res.body.notes).to.eql(testItem.notes);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('status');
            });
    });
    it('PATCH /api/items/:item_id responds with 204', () => {
        const testId = 1;
        const itemUpdate = {
            "name": "Update Item",
            "assign": "You",
            "notes": "Updated.",
            "status": "done"
        };

        return supertest(app)
            .patch(`/api/items/${testId}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .send(itemUpdate)
            .expect(204);
    });

    it('DELETE /api/items/:item_id responds with 204', () => {
        const testId = 1;

        return supertest(app)
            .delete(`/api/items/${testId}`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .expect(204);
    });

    it('POST /api/items responds with 201 and json object', () => {
        const newItem = {
            "list_id": 1,
            "name": "Test Item",
            "assign": "Me",
            "notes": "Test Test Test"
        };

        return supertest(app)
            .post(`/api/items`)
            .set('Authorization', `Bearer ${API_TOKEN}` )
            .send(newItem)
            .expect(201)
            .expect(res => {
                expect(res.body.list_id).to.eql(newItem.list_id);
                expect(res.body.name).to.eql(newItem.name);
                expect(res.body.assign).to.eql(newItem.assign);
                expect(res.body.notes).to.eql(newItem.notes);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('status');
            });
  
    });
});