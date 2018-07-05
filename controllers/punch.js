var Punch = require('../models/training_punch')

// 打卡
var punchInSchedule = function(req, res, next) {
    // 校验表单
    if (!req.body.description || !req.body.schedule_id || !req.body.completion) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong format'
        })
    }
    var image_url = ''
    if (req.file) {
        image_url = 'img/'+req.file.filename
    }
    // 打卡
    Punch.create(req.session.openid, req.body.schedule_id, req.body.completion, req.body.description, image_url)
    .then(function(result) {
        return res.status(201).json({
            code: 201,
            msg: '[Success] Punch in successfully',
            data: result[0]
        })
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal error.',
            errdata: err
        })
    })
}

// 获取打卡信息
var getPunchInformation = function(req, res, next) {
    // 校验表单
    req.query.schedule_id = Number(req.query.schedule_id)
    req.query.team_id = Number(req.query.team_id)
    if (!(req.query.option === 'team' || req.query.option === 'private')
        || !req.query.team_id || !req.query.schedule_id || !req.query.b_date || !req.query.e_date) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong query format'
        })
    }
    var get_punch
    if (req.query.option === 'team') {
        get_punch = Punch.get_private
    }
    else {
        get_punch = Punch.get_team
    }
    get_punch(req.session.openid, req.query.team_id, req.query.schedule_id, req.query.b_date, req.query.e_date)
    .then(function(result) {
        return res.status(200).json({
            code: 200,
            msg: '[Success] Get punch in successfully',
            data: result
        })
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal error.',
            errdata: err
        })
    })
}

module.exports = {
    punchInSchedule: punchInSchedule,
    getPunchInformation: getPunchInformation
}
