const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server').app;
const db = require('../server').db;
const should = chai.should();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
let ObjectID = require('mongodb').ObjectID;

chai.use(chaiHttp);
let auth;
let header;

before(function(done) {
  server.on('StartedMongodb', function(){
    console.log('db is connected');
    done();
  });
});

describe.only('/GET events', () => {

  beforeEach(function(done) {                // runs before each test in this block
    let testUser;
    bcrypt.hash('testAdmin', 10, (err,hash) => {
      if(err) {
        console.log(err);
        return;
      };
      testUser = {
        userName: 'testAdmin',
        email: 'testadmin@admin.com',
        password: hash,
        fullName: 'Test Administrator'
      };
      db.collection("users").insert(testUser, function(err,res){
        if (err){
          console.log(err);
          return;
        }
        //console.log(res);
        auth = 'Basic ' + Buffer.from('testAdmin' + ':' + 'testAdmin').toString('base64');
        header = {'Authorization': auth};
        done();
      });
    });
  });

  it('should GET all the events', (done) => {
    chai.request(server).get('/events').set(header).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
  });

  afterEach(function(done){
    db.collection("users").remove({userName: 'testAdmin'}, (err, res) => {
      if (err) {
        console.log(err);
        return ;
      }
      const response = {
        message: "successfully deleted"
      };
      console.log(response);
      done();
    });
  });
});

describe('/POST event', () => {

    let event12;    // event to be posted

    beforeEach(function(done) {                // runs before each test in this block
      let testUser;
      let testuser_id = new ObjectID();
      bcrypt.hash('testAdmin', 10, (err,hash) => {
        if(err) {
          console.log(err);
          return;
        } else {
          testUser = {
            _id: testuser_id,
            userName: 'testAdmin',
            email: 'testadmin@admin.com',
            password: hash,
            fullName: 'Test Administrator'
            };
          db.collection("users").insert(testUser, function(err,res){
            if (err){
              console.log(err);
            }
            //console.log(res);
            auth = 'Basic ' + Buffer.from('testAdmin' + ':' + 'testAdmin').toString('base64');
            header = {'Authorization': auth};
            event12 = {
                  title: "tie",
                  description: "qwewew",
                  date: "12.06.2019"
                      };
            done();
            });
          };
        });
    });

  it('it should POST a event', (done) => {

      chai.request(server)
      .post('/events')
      .set(header)
      .send(event12)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('description');
        res.body.should.have.property('date');
      done();
    });
  });

  afterEach(function(done){
    db.collection("users").remove({userName: 'testAdmin'}, (err, res) => {
      if (err) {
        console.log(err);
        return } ;
      const response = {
        message: "successfully deleted user" };
      console.log(response);
    });
    db.collection("events").remove({
      title: "tie",
      description: "qwewew",
      date: "12.06.2019"}, (err,res) => {
      if (err) {
        console.log(err);
        return ;
      }
      const response = {
        message: "successfully deleted event"
      };
      console.log(response);
      done();
    });
  });

});


describe('/GET events/:id', () => {
  let test_Id = new ObjectID();
  let user_Id = new ObjectID();

  beforeEach(function(done) {                // runs before each test in this block
    bcrypt.hash('testAdmin', 10, (err,hash) => {
      if(err) {
        console.log(err);
        return;
      } else {
        testUser = {
          _id: user_Id,
          userName: 'testAdmin',
          email: 'testadmin@admin.com',
          password: hash,
          fullName: 'Test Administrator'
        };
        let event12 = {
          _id: test_Id,
          title: "title10",
          description: "Testing http protocols1",
          date: "12.06.2019",
          user: testUser
        };
        db.collection("events").insert(event12, function(err,res){
          if (err){
            console.log(err);
          }
          //console.log(res);
          db.collection("users").insert(testUser, function(err,res){
            if (err){
              console.log(err);
            }
            //console.log(res);
            auth = 'Basic ' + Buffer.from('testAdmin' + ':' + 'testAdmin').toString('base64');
            header = {'Authorization': auth};
            done();
          });
        });
      };
    });
  });

  it('should return an event by id', (done) => {
    chai.request(server)
      .get('/events/' + test_Id).set(header)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.title.should.equal("title10");
        res.body.description.should.equal("Testing http protocols1");
        res.body.date.should.equal("2019-12-05T23:00:00.000Z");
        done();
      });
  });

  afterEach(function(done) {
    db.collection("events").remove({
      _id: test_Id,
      title: "title10",
      description: "Testing http protocols1",
      date: "2019-12-05T23:00:00.000Z"}, (err,res) => {
        if (err) {
          console.log(err);
          return ;
        }
        console.log({message: "successfully deleted event"});
      });

    db.collection("users").remove({userName: 'testAdmin'}, (err, res) => {
      if (err) {
        console.log(err);
        return } ;
      console.log({message: "successfully deleted user"});
      done();
        });
      });
});

describe('/PATCH events/:id', () => {
  let test_Id = new ObjectID();
  let user_Id = new ObjectID();

  beforeEach(function(done) {                // runs before each test in this block
    bcrypt.hash('testAdmin', 10, (err,hash) => {
      if(err) {
        console.log(err);
        return;
      } else {
        testUser = {
          _id: user_Id,
          userName: 'testAdmin',
          email: 'testadmin@admin.com',
          password: hash,
          fullName: 'Test Administrator'
        };
        let event12 = {
          _id: test_Id,
          title: "title10",
          description: "Testing http protocols1",
          date: "12.06.2019",
          user: testUser
        };
        db.collection("events").insert(event12, function(err,res){
          if (err){
            console.log(err);
          }
          db.collection("users").insert(testUser, function(err,res){
            if (err){
              console.log(err);
            }
            auth = 'Basic ' + Buffer.from('testAdmin' + ':' + 'testAdmin').toString('base64');
            header = {'Authorization': auth};
            done();
          });
        });
      };
    });
  });

  it('should update an event', (done) => {
    chai.request(server)
    .patch('/events/' + test_Id).set(header)
    .send({description: "ewa"}).end((err, res) => {
      res.should.have.status(200);
      chai.request(server).get('/events/' + test_Id).set(header).end((err, res) => {
        res.should.have.status(200);
        res.body.description.should.equal("ewa");
        done();
      });
    });
  });

  afterEach(function(done) {
    db.collection("events").remove({
      _id: test_Id,
      title: "title10",
      description: "ewa",
      date: "2019-12-05T23:00:00.000Z"}, (err,res) => {
        if (err) {
          console.log(err);
          return ;
        }
        console.log({message: "successfully deleted event"});
      });

    db.collection("users").remove({userName: 'testAdmin'}, (err, res) => {
        if (err) {
          console.log(err);
          return } ;
          console.log({message: "successfully deleted user"});
          done();
        });
      });

});

describe('/DELETE events/:id', () => {
  let test_Id = new ObjectID();
  let user_Id = new ObjectID();


  beforeEach(function(done) {                // runs before each test in this block
    bcrypt.hash('testAdmin', 10, (err,hash) => {
      if(err) {
        console.log(err);
        return;
      } else {
        testUser = {
          _id: user_Id,
          userName: 'testAdmin',
          email: 'testadmin@admin.com',
          password: hash,
          fullName: 'Test Administrator'
        };
        let event12 = {
          _id: test_Id,
          title: "title10",
          description: "Testing http protocols1",
          date: "12.06.2019",
          user: testUser
        };
        db.collection("events").insert(event12, function(err,res){
          if (err){
            console.log(err);
          }
          db.collection("users").insert(testUser, function(err,res){
            if (err){
              console.log(err);
            }
            auth = 'Basic ' + Buffer.from('testAdmin' + ':' + 'testAdmin').toString('base64');
            header = {'Authorization': auth};
            done();
          });
        });
      };
    });
  });

  it('should DELETE an event by id', (done) => {
    chai.request(server)
    .delete('/events/' + test_Id).set(header)
    .end((err, res) => {
      res.should.have.status(200);
      chai.request(server)
      .get('/events/' + test_Id).set(header)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

  afterEach(function(done){
    db.collection("users").remove({userName: 'testAdmin'}, (err, res) => {
      if (err) {
        console.log(err);
        return } ;
        console.log({message: "successfully deleted user"});
        done();
      });
    });
});
