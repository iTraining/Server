var Record = require('../models/testing_record')

// 上传成绩
var uploadTestingRecord = function(req, res, next) {
    // 校验表单
    if (!req.body.reference_id || !req.body.group_id || !req.body.data) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong format'
        })
    }
    // 打卡
    Record.create(req.body.reference_id, req.body.group_id, req.body.data, req.session.openid)
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

// 获取成绩
var getRecords = function(req, res, next) {
    // 校验表单
    req.query.team_id = Number(req.query.team_id)
    req.query.schedule_id = Number(req.query.schedule_id)
    if (!(req.query.option === 'team' || req.query.option === 'private')
        || !req.query.team_id || !req.query.schedule_id || !req.query.b_date || !req.query.e_date) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong query format'
        })
    }
    var get_record
    if (req.query.option === 'team') {
        get_record = Record.get_private
    }
    else {
        get_record = Record.get_team
    }
    get_record(req.session.openid, req.query.schedule_id, req.query.team_id, req.query.b_date, req.query.e_date)
    .then(function(result) {
        return res.status(200).json({
            code: 200,
            msg: '[Success] Get records in successfully',
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
    uploadTestingRecord: uploadTestingRecord,
    getRecords: getRecords
}
