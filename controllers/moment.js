var Punch = require('../models/training_punch')

// 获取动态信息
var getMomentInformation = function(req, res, next) {
    // 校验表单
    if (!req.query.b_date || !req.query.e_date) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong query format'
        })
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
    getMomentInformation: getMomentInformation
}