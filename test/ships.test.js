process.env.NODE_ENV = 'test';

const { User, Ship, Config } = require('../src/models/');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

// eslint-disable-next-line
const should = chai.should();
chai.use(chaiHttp);

let defenderId;

describe('Ships', () => {
  beforeEach((done) => {
    Promise.all([
      User.remove({}),
      Ship.remove({}),
      Config.remove({})
    ])
    .then(() => {
      const user = {
        username: 'docker',
        userType: 'defender',
        gameNumber: 1
      };
      chai.request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        defenderId = res.body.userId;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`In game 1: ${user.username} is ${user.userType}.`);
        res.body.should.have.property('userId');
        done();
      });
    });
  });
  describe('POST /ships/:shipType', () => {
    it('it should placed submarine', (done) => {
      const shipType = 'submarine';
      const ship = {
        userId: defenderId,
        positions: [69]
      };
      const remaining = {
        battleship: 1,
        cruiser: 2,
        destroyer: 3,
        submarine: 3
      };
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        res.body.should.have.property('remaining').eql(remaining);
        done();
      });
    });
    it('it should placed destroyer', (done) => {
      const shipType = 'destroyer';
      const ship = {
        userId: defenderId,
        positions: [69, 79]
      };
      const remaining = {
        battleship: 1,
        cruiser: 2,
        destroyer: 2,
        submarine: 4
      };
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        res.body.should.have.property('remaining').eql(remaining);
        done();
      });
    });
    it('it should placed cruiser', (done) => {
      const shipType = 'cruiser';
      const ship = {
        userId: defenderId,
        positions: [69, 79, 89]
      };
      const remaining = {
        battleship: 1,
        cruiser: 1,
        destroyer: 3,
        submarine: 4
      };
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        res.body.should.have.property('remaining').eql(remaining);
        done();
      });
    });
    it('it should placed battleship', (done) => {
      const shipType = 'battleship';
      const ship = {
        userId: defenderId,
        positions: [69, 79, 89, 99]
      };
      const remaining = {
        battleship: 0,
        cruiser: 2,
        destroyer: 3,
        submarine: 4
      };
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        res.body.should.have.property('remaining').eql(remaining);
        done();
      });
    });
  });
  describe('PUT /ships', () => {

  });
  describe('DELETE /ships', () => {

  });
});
