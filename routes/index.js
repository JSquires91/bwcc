const express = require('express')
const router = express.Router()
const Fixture = require('../models/fixture')

router.get('/',  async (req, res) => {
    let fixtures
    let lastWeek= new Date()
    lastWeek.setDate(lastWeek.getDate() -7)
    try {
        fixtures = await Fixture.find({"date": {$gte: lastWeek}}).exec()
    }catch {
        fixtures = []
    }
    res.render('index', {fixtures: fixtures})
})

module.exports = router