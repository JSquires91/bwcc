const express = require('express')
const team = require('../models/team')
const router = express.Router()
const Team = require('../models/team')

//All teams route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const teams = await Team.find(searchOptions)
        res.render('teams/index', { 
            teams: teams,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }
})

//New team route
router.get('/new', (req, res) => {
    res.render('teams/new', { team: new Team() })
})

//Create teams route
router.post('/', async (req, res) => {
    const team = new Team({
        name: req.body.name,
        type: req.body.type
    })
    try{
        const newTeam = await team.save()
        res.redirect(`teams`);
        // res.render(`teams/${newTeam.id}`)

    }catch{
        res.render('teams/new', {
            team: team,
            errorMessage: 'Error creating Team'
            })  
    }
})

module.exports = router