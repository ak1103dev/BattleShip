process.env.NODE_ENV = 'test';

const { User } = require('../src/models/');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

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
        res.body.should.have.property('userId');
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
        res.body.should.have.property('userId');
        done();
      });
    });
    it('it should not regiser because of invalid userType', (done) => {
      const user = {
        username: 'xxx',
        userType: 'student'
      };
      chai.request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').be.a('array');
        done();
      });
    });
    it('it should not regiser because of invalid username', (done) => {
      const user = {
        username: '',
        userType: 'student'
      };
      chai.request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').be.a('array');
        done();
      });
    });
    it('it should not regiser because of invalid username and userType', (done) => {
      const user = {
        username: '',
        userType: ''
      };
      chai.request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').be.a('array');
        done();
      });
    });
  });
});
