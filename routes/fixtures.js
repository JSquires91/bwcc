const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Fixture = require('../models/fixture')
const uploadPath = path.join('public', Fixture.teamSheetImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Team = require('../models/team')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

//All fixtures route
router.get('/', async (req, res) => {
    let query = Fixture.find()
    if (req.query.location != null && req.query.location != '') {
        query = query.regex('location', new RegExp(req.query.location, 'i'))
    }
    if (req.query.dateTo != null && req.query.dateTo != '') {
        query = query.lte('date', req.query.dateTo)
    }
    if (req.query.dateFrom != null && req.query.dateFrom != '') {
        query = query.gte('date', req.query.dateFrom)
    }
    try {
        const fixtures =  await query.exec()
        res.render('fixtures/index', {
            fixtures: fixtures,
            searchOptions: req.query
            })
    }catch {
        res.redirect('/')
    }
})

//New fixture route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Fixture())
})

//Create fixture route
router.post('/', upload.single('teamsheet'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const fixture = new Fixture ({
    opponent: req.body.opponent,
    location: req.body.location,
    date: new Date(req.body.date),
    team: req.body.team,
    result: req.body.result,
    scorecardLink: req.body.scorecardLink,
    teamSheetName: fileName,
   })

   try {
        const newFixture = await fixture.save()
        res.redirect(`fixtures`);
        // res.render(`teams/${newFixture.id}`)
   } catch {
    if (fixture.teamSheetName != null){
    removeTeamSheet(fixture.teamSheetName)
    }
    renderNewPage(res, fixture, true)
   }
})

function removeTeamSheet(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.err(err)
    })
}

async function renderNewPage(res, fixture, hasError = false) {
    try {
        const teams = await Team.find({})
        const params = {
            teams: teams,
            fixture: fixture
        }
        if (hasError) params.errorMessage= 'Error Creating Fixture'
        res.render('fixtures/new', params)
    } catch {
     res.redirect('/fixtures')
    }
}

module.exports = router