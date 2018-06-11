var express = require('express')
var router = express.Router()

var authController = require('./controllers/auth')
var teamController = require('./controllers/team')

// API

// '/session'
router.get('/session', authController.createSession)

// '/team'
router.post('/team', teamController.createNewTeam)
router.get('/team', teamController.getTeams)
router.get('/team/invitation', teamController.getInvitationLink)
router.get('/team/join', teamController.joinTeam)

// '/schedule'



module.exports = router