process.env.NODE_ENV = 'test';

const { User, Ship, Config, Attack } = require('../src/models/');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

// eslint-disable-next-line
const should = chai.should();
chai.use(chaiHttp);

let defenderId;
let attackerId;

describe.only('End to end test', () => {
  before((done) => {
    Promise.all([
      User.remove({}),
      Ship.remove({}),
      Config.remove({}),
      Attack.remove({})
    ])
    .then(() => done());
  });
  describe('1. Register User', () => {
    it('it should register defender', (done) => {
      const defender = {
        username: 'docker',
        userType: 'defender',
        gameNumber: 1
      };
      chai.request(app)
      .post('/users')
      .send(defender)
      .end((err, res) => {
        defenderId = res.body.userId;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`In game 1: ${defender.username} is ${defender.userType}.`);
        res.body.should.have.property('userId');
        done();
      });
    });
    it('it should register attacker', (done) => {
      const attacker = {
        username: 'adam',
        userType: 'attacker',
        gameNumber: 1
      };
      chai.request(app)
      .post('/users')
      .send(attacker)
      .end((err, res) => {
        attackerId = res.body.userId;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`In game 1: ${attacker.username} is ${attacker.userType}.`);
        res.body.should.have.property('userId');
        done();
      });
    });
  });
  describe('2. Place all ship', () => {
    const requestShip = (done, shipType, ship) => {
      chai.request(app)
      .post(`/ships/${shipType}`)
      .send(ship)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`placed ${shipType}`);
        done();
      });
    };
    it('it should place battleship', (done) => {
      const ship = {
        userId: defenderId,
        positions: [69, 79, 89, 99]
      };
      const shipType = 'battleship';
      requestShip(done, shipType, ship);
    });
    it('it should place cruiser 1', (done) => {
      const ship = {
        userId: defenderId,
        positions: [11, 12, 13]
      };
      const shipType = 'cruiser';
      requestShip(done, shipType, ship);
    });
    it('it should place cruiser 2', (done) => {
      const ship = {
        userId: defenderId,
        positions: [32, 33, 34]
      };
      const shipType = 'cruiser';
      requestShip(done, shipType, ship);
    });
    it('it should place destroyer 1', (done) => {
      const ship = {
        userId: defenderId,
        positions: [16, 26]
      };
      const shipType = 'destroyer';
      requestShip(done, shipType, ship);
    });
    it('it should place destroyer 2', (done) => {
      const ship = {
        userId: defenderId,
        positions: [29, 39]
      };
      const shipType = 'destroyer';
      requestShip(done, shipType, ship);
    });
    it('it should place destroyer 3', (done) => {
      const ship = {
        userId: defenderId,
        positions: [51, 52]
      };
      const shipType = 'destroyer';
      requestShip(done, shipType, ship);
    });
    it('it should place submarine 1', (done) => {
      const ship = {
        userId: defenderId,
        positions: [90]
      };
      const shipType = 'submarine';
      requestShip(done, shipType, ship);
    });
    it('it should place submarine 2', (done) => {
      const ship = {
        userId: defenderId,
        positions: [54]
      };
      const shipType = 'submarine';
      requestShip(done, shipType, ship);
    });
    it('it should place submarine 3', (done) => {
      const ship = {
        userId: defenderId,
        positions: [57]
      };
      const shipType = 'submarine';
      requestShip(done, shipType, ship);
    });
    it('it should place submarine 4', (done) => {
      const ship = {
        userId: defenderId,
        positions: [30]
      };
      const shipType = 'submarine';
      requestShip(done, shipType, ship);
    });
  });
  describe('3. Attack the ocean', () => {
    const getMessage = (x) => ({
      miss: 'Miss',
      hit: 'Hit',
      sank: `You just sank the ${x}`,
      win: `Win ! You completed the game in ${x} moves`
    });
    const requestAttack = (done, position, message) => {
      const data = {
        userId: attackerId
      };
      chai.request(app)
      .post(`/attack/${position}`)
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(message);
        done();
      });
    };
    it('attack 55, it should miss', (done) => {
      const position = 55;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 54, it should sank a ship', (done) => {
      const position = 54;
      requestAttack(done, position, getMessage('submarine').sank);
    });
    it('attack 34, it should hit', (done) => {
      const position = 34;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 33, it should hit', (done) => {
      const position = 33;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 32, it should sank a ship', (done) => {
      const position = 32;
      requestAttack(done, position, getMessage('cruiser').sank);
    });
    it('attack 30, it should sank a ship', (done) => {
      const position = 30;
      requestAttack(done, position, getMessage('submarine').sank);
    });
    it('attack 10, it should miss', (done) => {
      const position = 10;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 11, it should hit', (done) => {
      const position = 11;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 12, it should hit', (done) => {
      const position = 12;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 13, it should sank a ship', (done) => {
      const position = 13;
      requestAttack(done, position, getMessage('cruiser').sank);
    });
    it('attack 15, it should miss', (done) => {
      const position = 15;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 16, it should hit', (done) => {
      const position = 16;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 17, it should miss', (done) => {
      const position = 17;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 26, it should sank a ship', (done) => {
      const position = 26;
      requestAttack(done, position, getMessage('destroyer').sank);
    });
    it('attack 90, it should sank a ship', (done) => {
      const position = 90;
      requestAttack(done, position, getMessage('submarine').sank);
    });
    it('attack 57, it should sank a ship', (done) => {
      const position = 57;
      requestAttack(done, position, getMessage('submarine').sank);
    });
    it('attack 50, it should miss', (done) => {
      const position = 50;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 51, it should hit', (done) => {
      const position = 51;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 52, it should sank a ship', (done) => {
      const position = 52;
      requestAttack(done, position, getMessage('destroyer').sank);
    });
    it('attack 59, it should miss', (done) => {
      const position = 59;
      requestAttack(done, position, getMessage().miss);
    });
    it('attack 69, it should hit', (done) => {
      const position = 69;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 79, it should hit', (done) => {
      const position = 79;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 89, it should hit', (done) => {
      const position = 89;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 99, it should sank a ship', (done) => {
      const position = 99;
      requestAttack(done, position, getMessage('battleship').sank);
    });
    it('attack 39, it should hit', (done) => {
      const position = 39;
      requestAttack(done, position, getMessage().hit);
    });
    it('attack 29, it should win', (done) => {
      const position = 29;
      requestAttack(done, position, getMessage(26).win);
    });
  });
});
