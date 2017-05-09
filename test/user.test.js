process.env.NODE_ENV = 'test';

const { User } = require('../src/models/');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
	  User.remove({}, (err) => {
		  done();
	  });
  });
  describe('POST /users', () => {
    it('it should register defender', (done) => {
      const user = {
        username: 'docker',
        userType: 'defender'
      };
      chai.request(app)
		  .post('/users')
      .send(user)
		  .end((err, res) => {
			  res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`${user.username} is ${user.userType}.`);
        done();
      });
    });
    it('it should register attacker', (done) => {
      const user = {
        username: 'adam',
        userType: 'attacker'
      };
      chai.request(app)
		  .post('/users')
      .send(user)
		  .end((err, res) => {
			  res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql(`${user.username} is ${user.userType}.`);
        done();
      });
    });
  });
});
