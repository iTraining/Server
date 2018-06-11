var Team = require('../models/team')
var config = require('../config/config')
// 创建新队伍
var createNewTeam = function (req, res, next) {
    Team.create(req.body.name, req.body.bio, req.session.openid)
    .then(function(result) {
        console.log(result)
        res.status(201).json({
            code: 201,
            msg: '[Sucess] Create team sucessfully',
            data: result[0]
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
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
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
            errcode: 500,
            errmsg: '[Error] Internal error.',
            errdata: err
        })
    })
}

// 获取邀请链接
var getInvitationLink = function (req, res, next) { 
    // 校验
    if (req.query.team_id == undefined || req.query.team_id == '') {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    // 校验是否为队伍创建人

    Team.get_token(req.query.team_id, req.session.openid)
    .then(function(result) {
        // 检查是否为空
        if (result[0].join_token) {
            // 检查旧的是否过期
            var date = new Date()
            var token_date = new Date(Buffer(result[0].join_token, 'base64').toString())
            if ((date - token_date) < config.invite_token_ttl) {
                return res.status(200).json({
                    code: 200,
                    msg: '[Success] Get link successfully',
                    data: 'https://itraining.zhanzy.xyz/team/join?token='+result[0]+
                    '&team_id='+req.query.team_id.toString()
                })
            }
        }
        // 更新token
        return Team.update_token(req.query.team_id, req.session.openid)
        .then(function(new_token) {
            // 更新
            if (new_token) {
	    	return res.status(200).json({
        	    code: 200,
                    msg: '[Success] Get link successfully',
                    data: 'https://itraining.zhanzy.xyz/team/join?token='+new_token+
                    '&team_id='+req.query.team_id.toString()
                })
	    }
	    return res.status(403).json({
		errcode: 403,
		errmsg: '[Error] Wrong leader_id'
	    })
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

var joinTeam = function(req, res, next) {
    // 校验token team_id存在性
    if (req.query.token === '' || req.query.token === undefined
        || req.query.team_id === '' || req.query.team_id === undefined) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    Team.get_token(req.query.team_id)
    .then(function(result) {
        if (result[0] !== undefined && req.query.token === result[0]) { 
            // 校验日期是否合法
            var token_date = new Date(Buffer(result[0], 'base64').toString())
            var date = new Date()
            if ((date - token_date) < config.invite_token_ttl) {
                // 成功校验，添加成员
                return Team.create_join(req.session.openid, req.query.team_id)
                .then(function(result) {
                    return res.status(200).json({
                        code: 200,
                        msg: '[Success] Join successfully'
                    })
                })
            }
        }
        return req.status(403).json({
            errcode: 403,
            errmsg: '[Error] Token is no exist or is out of date.'
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



module.exports={
    createNewTeam: createNewTeam,
    getTeams: getTeams,
    getInvitationLink: getInvitationLink,
    joinTeam: joinTeam
}
