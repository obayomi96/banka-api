import { expect } from 'chai';
import supertest from 'supertest';
import app from '../api/v1/app';

const request = supertest(app);
const apiEndPoint = '/api/v1/';
const usersEndPoint = `${apiEndPoint}auth/`;
const accountEndPoint = `${apiEndPoint}accounts/`;

const user = {
  id: 5,
  email: 'oluwaseun@gmail.com',
  firstname: 'Oluwaseun',
  lastname: 'Christopher',
  password: 'userPW',
  type: 'client',
  isAdmin: false
};

describe(`GET ${apiEndPoint}`, () => {
  it('Should load', (done) => {
    request
      .get(apiEndPoint)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('Welcome to banka 1.0');
        done();
      });
  });
});

describe('Users auth Tests', () => {
  describe(`POST ${usersEndPoint}signup`, () => {
    it('Should create a new user', (done) => {
      request
        .post(`${usersEndPoint}signup`)
        .set('content-type', 'application/json')
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe(`POST ${usersEndPoint}signin`, () => {
    it('Should login a valid user', (done) => {
      const login = {
        email: 'emmatexi@gmail.com',
        password: 'user4pw'
      };
      request
        .post(`${usersEndPoint}signin`)
        .set('content-type', 'application/json')
        .send(login)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
  });
});

describe('Accounts Tests', () => {
  describe(`POST ${accountEndPoint}createAccount`, () => {
    it('Should create a bank account', (done) => {
      const login = {
        email: 'franca@gmail.com',
        password: 'user3pw'
      };
      request
        .post(`${usersEndPoint}signin`)
        .send(login)
        .end((usrLoginErr, usrLoginRes) => {
          const token = `Bearer ${usrLoginRes.body.data.token}`;
          const usrInput = {
            type: 'current',
            initialDeposit: 50.50
          };
          request
            .post(`${accountEndPoint}createAccount`)
            .set('Authorization', token)
            .send(usrInput)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).to.equal(201);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('data');
              expect(res.body.data).to.have.an('object');
              done();
            });
        });
    });
  });
  describe(`PATCH ${accountEndPoint}:accountNumber`, () => {
    it('Should change an account status', (done) => {
      const login = {
        email: 'martinsoluwaseun47@gmail.com',
        password: 'user1pw'
      };
      request
        .post(`${usersEndPoint}signin`)
        .send(login)
        .end((usrLoginErr, usrLoginRes) => {
          const token = `Bearer ${usrLoginRes.body.data.token}`;
          request
            .patch(`${accountEndPoint}3839943693`)
            .set('Authorization', token)
            .send({ status: 'Active' })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('data');
              expect(res.body.data).to.have.an('object');
              expect(res.body.data).to.have.property('status');
              done();
            });
        });
    });
  });
  describe(`DELETE ${accountEndPoint}:accountNumber`, () => {
    it('Should delete an account successfully', (done) => {
      const login = {
        email: 'martinsoluwaseun47@gmail.com',
        password: 'user1pw'
      };
      request
        .post(`${usersEndPoint}signin`)
        .send(login)
        .end((usrLoginErr, usrLoginRes) => {
          const token = `Bearer ${usrLoginRes.body.data.token}`;
          request
            .delete(`${accountEndPoint}2239002933`)
            .set('content-type', 'application/json')
            .set('Authorization', token)
            .send({ accountNumber: 2239002933 })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('msg');
              done();
            });
        });
    });
  });
});
