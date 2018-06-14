var Team = require('../models/team')
var Meta = require('../models/training_meta')

// 创建训练头信息
var createMeta = function(req, res, next) {
    // 校验post format
    if (!req.body.team_id || !req.body.training_name
        || !req.body.index1 || !req.body.index2
        || !req.body.index3 || !req.body.index4) {
        return res.status(400).json({
            code: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    // 校验身份，查看是否是leader
    Team.get_one(req.body.team_id)
    .then(function(result) {
        if (result[0].leader_id == req.session.openid) {
            // 已确认身份，插入meta
            return Meta.create(req.body.training_name,
                req.body.index1, req.body.index2,
                req.body.index3, req.body.index4,
                req.body.team_id)
            .then(function(result) {
                return res.status(201).json({
                    code: 201,
                    msg: '[Success] Training meta created',
                    data: result[0]
                })
            })
        }
        else {
            return res.status(403).json({
                code: 403,
                errmsg: '[Error] You are no leader of team'
            })
        }
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            code: 500,
            errmsg: '[Error] Internal error.',
            errdata: err
        })
    })

}

module.exports = {
    createMeta: createMeta
}