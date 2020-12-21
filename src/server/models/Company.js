const mongoose = require('mongoose')
const Schema  = mongoose.Schema;
const bcrypt = require('bcrypt')

const Company = new Schema ({
  name: {
    type: String,
    required: true
  },
  red61_username: String,
  red61_password: String
})

Company.pre(
  'save',
  async function(next) {
    let company = this;
    if(company.red61_username) {
      const hash = await bcrypt.hash(company.red61_username, 10)
      company.red61_username = hash
    }

    if(company.red61_password) {
      const hash = await bcrypt.hash(company.red61_password, 10)
      company.red61_password = hash
    }

    next()
  }
)

Company.pre(
  'updateOne',
  async function(next) {
    let company = this;
    if(company.red61_username) {
      const hash = await bcrypt.hash(company.red61_username, 10)
      company.red61_username = hash
    }

    if(company.red61_password) {
      const hash = await bcrypt.hash(company.red61_password, 10)
      company.red61_password = hash
    }

    next()
  }
)

/// ADD COMPANY.METHODS for providing plaintext red61 details

module.exports = mongoose.model("Company", company)