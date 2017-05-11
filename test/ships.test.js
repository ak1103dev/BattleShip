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
    it('it should place submarine', (done) => {
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
    it('it should place destroyer', (done) => {
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
    it('it should place cruiser', (done) => {
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
    it('it should place battleship', (done) => {
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
    it('it should not place battleship because of illegal placement', (done) => {
      const shipType1 = 'destroyer';
      const ship1 = {
        userId: defenderId,
        positions: [67, 68]
      };
      const shipType2 = 'battleship';
      const ship2 = {
        userId: defenderId,
        positions: [69, 79, 89, 99]
      };
      chai.request(app)
      .post(`/ships/${shipType1}`)
      .send(ship1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType1}`);
        chai.request(app)
        .post(`/ships/${shipType2}`)
        .send(ship2)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql(`Can not place ${shipType2} because of illegal placement`);
          done();
        });
      });
    });
    it('it should not place battleship because of fulled battleship', (done) => {
      const shipType1 = 'battleship';
      const ship1 = {
        userId: defenderId,
        positions: [10, 11, 12, 13]
      };
      const shipType2 = 'battleship';
      const ship2 = {
        userId: defenderId,
        positions: [69, 79, 89, 99]
      };
      chai.request(app)
      .post(`/ships/${shipType1}`)
      .send(ship1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType1}`);
        chai.request(app)
        .post(`/ships/${shipType2}`)
        .send(ship2)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql(`Can not place ${shipType2} because of fulling`);
          done();
        });
      });
    });
  });
  describe('DELETE /ships', () => {
    const deleteShipSuccess = (done, shipType, ship, delShip) => {
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        chai.request(app)
        .delete(`/ships/${shipType}`)
        .send(delShip)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
      });
    };
    const deleteShipFail = (done, shipType, ship, delShip) => {
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        chai.request(app)
        .delete(`/ships/${shipType}`)
        .send(delShip)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('No ship in the position');
          done();
        });
      });
    };
    it('it should delete submarine', (done) => {
      const shipType = 'submarine';
      const ship = {
        userId: defenderId,
        positions: [69]
      };
      const delShip = {
        userId: defenderId,
        position: 69
      };
      deleteShipSuccess(done, shipType, ship, delShip);
    });
    it('it should delete destroyer', (done) => {
      const shipType = 'destroyer';
      const ship = {
        userId: defenderId,
        positions: [69, 79]
      };
      const delShip = {
        userId: defenderId,
        position: 69
      };
      deleteShipSuccess(done, shipType, ship, delShip);
    });
    it('it should delete cruiser', (done) => {
      const shipType = 'cruiser';
      const ship = {
        userId: defenderId,
        positions: [59, 69, 79]
      };
      const delShip = {
        userId: defenderId,
        position: 69
      };
      deleteShipSuccess(done, shipType, ship, delShip);
    });
    it('it should delete battleship', (done) => {
      const shipType = 'battleship';
      const ship = {
        userId: defenderId,
        positions: [59, 69, 79, 89]
      };
      const delShip = {
        userId: defenderId,
        position: 69
      };
      deleteShipSuccess(done, shipType, ship, delShip);
    });
    it('it should not delete battleship because of no ship in the position', (done) => {
      const shipType = 'battleship';
      const ship = {
        userId: defenderId,
        positions: [59, 69, 79, 89]
      };
      const delShip = {
        userId: defenderId,
        position: 88
      };
      deleteShipFail(done, shipType, ship, delShip);
    });
  });
  describe('PUT /ships', () => {

  });
});
