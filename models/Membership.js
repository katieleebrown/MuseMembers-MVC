const mongoose = require('mongoose')

const MembershipSchema = new mongoose.Schema({
  museumName: {
    type: String,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Membership', MembershipSchema)
