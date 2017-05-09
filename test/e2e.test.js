process.env.NODE_ENV = 'test';

const { User } = require('../src/models/');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('End to end test', () => {
  beforeEach((done) => {
	  User.remove({}, (err) => {
		  done();
	  });
  });
  describe('1. Register User', () => {
    it('it should register defender', (done) => {
      const defender = {
        username: 'docker',
        userType: 'defender'
      };
      chai.request(app)
		  .post('/users')
      .send(defender)
		  .end((err, res) => {
			  res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`${defender.username} is ${defender.userType}.`);
        done();
      });
    });
    it('it should register attacker', (done) => {
      const attacker = {
        username: 'adam',
        userType: 'attacker'
      };
      chai.request(app)
		  .post('/users')
      .send(attacker)
		  .end((err, res) => {
			  res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`${attacker.username} is ${attacker.userType}.`);
        done();
      });
    });
  });
});
