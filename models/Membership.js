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
  place_id: {
    type: String,
  },
  // image: {
  //   type: String,
  // },
  // cloudinaryId: {
  //   type: String,
  // },
  notes: {
    type: String
  }
})

module.exports = mongoose.model('Membership', MembershipSchema)
