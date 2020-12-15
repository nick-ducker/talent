process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');
const mongoose = require('mongoose')
const User = require('../models/User.js')

const { expect } = chai;

chai.use(chaiHttp);

///// AUTH ROUTE TESTS ///////

after(() => {
  console.log('dropping db') 
  User.deleteMany({},(err) => {
    if (err) {
      console.log('There was a problem clearing the DB:', err)
    } else {
      console.log('DB successfully dropped')
    }
  }
)})

describe("Auth routes", () => {

  const userObject = {
    'name': 'nick',
    'nickname': 'funky duck',
    'is_artist': false,
    'email': "user@email.com",
    'password':  "password"
  }

  let validUserLogin = {
    "email": "user@email.com",
    "password": "password"
  }
 
  describe('POST /register', () => {

    it('should return 200OK with valid inputs', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send(userObject)
        .end((err, res) => {
          if(err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
        })
        done()
    })

    it('should not return 200OK without valid inputs', (done) => {
      chai.request(app)
        .post('/auth/register')
        .type('form')
        .send({nothing: "nadie"})
        .end((err, res) => {
          expect(res).to.have.status(500)
        })
        done()
    })

    it('should have inserted a new user into the DB', async () => {
      const firstUser = await User.findOne({email: 'user@email.com'})
      expect(firstUser).to.be.an('object'),
      expect(firstUser.email).to.equal('user@email.com')
    })
  })

  describe('POST /login', () => {
    
    it('should return 200OK with valid inputs and have a user attached', (done) => {
      chai.request(app)
        .post('/auth/login')
        .type('form')
        .send(validUserLogin)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.user).to.not.be.null
        })
        done()
    })

    it('should not return 200OK with invalid inputs', (done) => {
      chai.request(app)
        .post('/auth/login')
        .type('form')
        .send(validUserLogin)
        .end((err, res) => {
          expect(res).not.to.have.status(200)
          expect(res.user).to.not.be.null
        })
        done()
    })
  })

  describe('GET /logout', () => {

    it('should return an empty user', (done) => {
      chai.request(app)
        .get('/auth/logout')
        .end((err, res) => {
          expect(res).not.to.have.status(200)
          expect(res.user).to.be.null
        })
        done()
    })

  })

})

////////////// USER ROUTE TESTS ///////////////

describe("User routes", () => {

  let userObject = {}

  for (let index = 0; index < 11; index++) {
    userObject.email = `email${index}@email.com`
    userObject.name = `username${index}`
    userObject.password = `password${index}`
    if (index % 2 == 1) {
      userObject.is_artist = true
    }

    new User(userObject).save((err,user) => {
      if (err) {
        console.log(err)
      }
    })
  }

  describe("GET /all", () => {
    it('should return all users', (done) => {
      chai.request(app)
        .get('/all')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
        })
        done()
    })
  })

  describe("GET /allArtists", () => {
    it('should return only artists tied to user', (done) => {
      chai.request(app)
        .get('/allArtists')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
        })
        done()
    })
  })

  describe("GET /allProducers", () => {
    it('should return only producers tied to user', (done) => {
      chai.request(app)
        .get('/allProducers')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
        })
        done()
    })
  })

  describe("GET /:id", () => {
    it('should return only one specific user', (done) => {
      chai.request(app)
        .get('/5')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
        })
      done()
    })
  })

  describe("POST /:id", () => {
    it('should modify logged in user details and update', (done) => {
      const newDetails = {
        name: "new name",
        email: 'newemail@email.com'
      }

      chai.request(app)
        .post('/5')
        .send(newDetails)
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.user.name).to.equal('new name')
        })    
      done()  
    })
  })

  describe("POST /:id/company", () => {
    it('should add a company to a specific user', (done) => {
      chai.request(app)
        .post('/5')
        .send('1')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.user.companies[0]).to.be.an('object')
        })
      done()
    })
  })

  describe("DELETE /:id", () => {
    it('should delete profile of logged in user', (done) => {
      chai.request(app)
        .delete('/5')
        .end((err,res) => {
          if (err) {
            console.log(err)
          }
          expect(res).to.have.status(200)
          expect(res.user).to.be(null)
        })
      done()
    })
  })
  
})