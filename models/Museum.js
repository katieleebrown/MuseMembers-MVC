const mongoose = require('mongoose')

const MuseumSchema = new mongoose.Schema({
    museumName: {
        type: String,
    },
    place_id: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    formatted_address: {
        type: String,
    },
    hours: {
        type: Array,
    },
    website: {
        type: String,
    }
})

module.exports = mongoose.model('Museum', MuseumSchema)
