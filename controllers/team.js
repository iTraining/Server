var Team = require('../models/team')
// 创建新队伍
var createNewTeam = function (req, res, next) {
    Team.create(req.body.name, req.body.bio, req.session.openid)
    .then(function(result) {
        console.log(result)
        res.status(201).json({
            code: 201,
            msg: '[Sucess] Create team sucessfully',
            data: result
        })
    }).catch(function(err) {
        console.log(err)
        return res.status(401).json({
            code: 401,
            msg: '[Error] Insert data must be wrong.'
        })
    })
}
// 获取 【所有/参与/创建】 的队伍
var getTeams = function (req, res, next) {
    option = req.query.option
    
    if (!(option === 'joined' || option === 'all' || option === 'created')) {
        return res.status(401).json({
            code: 401,
            msg: '[Error] Wrong query format'
        })
    }

    Team.get(req.session.openid, option)
    .then(function(result) {
        res.status(200).json({
            code: 200,
            msg: '[Sucess] Get '+ option + ' teams sucessfully',
            data: result
        })
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            code: 500,
            msg: '[Error] Internal error.'
        })
    })
}


module.exports={
    createNewTeam: createNewTeam,
    getTeams: getTeams
}