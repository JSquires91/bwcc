const mongoose = require('mongoose')

const teamsSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Teams', teamsSchema)