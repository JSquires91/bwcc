const mongoose = require('mongoose')
const path = require('path')
const teamSheetImageBasePath = 'uploads/teamsheets'

const fixtureSchema = new mongoose.Schema ({
    opponent: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teams'
    },
    result: {
        type: String
    },
    scorecardLink: {
        type: String
    },
    teamSheetName: {
        type: String
    }
    

})

fixtureSchema.virtual('teamSheetImagePath').get(function() {
    if (this.teamSheetName != null) {
        return path.join('/', teamSheetImageBasePath, this.teamSheetName)
    }

})

module.exports = mongoose.model('Fixture', fixtureSchema)
module.exports.teamSheetImageBasePath = teamSheetImageBasePath