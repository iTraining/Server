var express = require('express')
var router = express.Router()

var multer  = require('multer')
var crypto = require('crypto')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
	    cb(null, 'uploads/img')
    },
    filename: function (req, file, cb) {
	if (req.session.openid) {
            var md5 = crypto.createHash('md5')

            file.originalname = file.originalname.replace(' ', '-')
            var names = file.originalname.split('.')
            
            var date = Date.now()
            var type = names.pop()
            var file_name = names.join('.')
            name = file_name + '_' + date
            
            name = md5.update(name).digest('hex')

            cb(null, name + '.' + type)
        }
    }
})
  
var upload = multer({ storage: storage })


var authController = require('./controllers/auth')
var teamController = require('./controllers/team')
var metaController = require('./controllers/meta')
var scheduleController = require('./controllers/schedule')

// API

// '/session'
router.post('/session', authController.createSession)

// '/team'
router.route('/team').post(upload.single('avatar'), teamController.createNewTeam)
router.get('/team', teamController.getTeams)
router.delete('/team', teamController.removeTeam)
router.route('/team/detail').put(upload.single('avatar'), teamController.updateTeam)
router.get('/team/invitation', teamController.getInvitationLink)
router.get('/team/join', teamController.joinTeam)
router.get('/team/member', teamController.getMember);
router.delete('/team/member', teamController.removeMember);

// '/schedule'
router.post('/schedule/meta', metaController.createMeta)
router.get('/schedule/meta', metaController.getMeta)
router.post('/schedule', scheduleController.createTeamSchedule)
router.get('/schedule', scheduleController.getScheduleDetail)
router.get('/schedule/collection', scheduleController.getScheduleList)


module.exports = router
