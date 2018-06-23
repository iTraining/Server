var Team = require('../models/team')
var User = require('../models/user')
var config = require('../config/config')
var fs = require("fs")
// 创建新队伍
var createNewTeam = function (req, res, next) { // 校验
    if (!req.body.name || !req.body.bio) {
        if (req.file) fs.unlinkSync('../'+req.file.path)
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong post format'
        })
    }
    var image_url = ''
    if (req.file) {
        image_url = 'img/'+req.file.filename
    }
    Team.create(req.body.name, req.body.bio, req.session.openid, image_url)
    .then(function(result) {
        res.status(201).json({
            code: 201,
            msg: '[Sucess] Create team sucessfully',
            data: result[0]
        })
    }).catch(function(err) {
	console.log(err)
        if (req.file) fs.unlinkSync('../'+req.file.path)
        return res.status(401).json({
            errcode: 401,
            errmsg: '[Error] The team name has been exist.',
            errdata: err
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

// 更新队伍
var updateTeam = function(req, res, next) {
    // 校验
    if (!req.body.name || !req.body.bio || !req.body.team_id) {
        if (req.file) fs.unlinkSync('../'+req.file.path)
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong post format'
        })
    }
    var image_url = ''
    if (req.file) {
        image_url = 'img/'+req.file.filename
    }

    // 更新对应队长的队伍
    Team.update_team(req.body.team_id, req.session.openid, req.body.name, req.body.bio, image_url)
    .then(function(result) {
        res.status(200).json({
            code: 200,
            msg: '[Sucess] Update team information sucessfully',
            data: result
        })
    })
    .catch(function(err) {
        console.log(err)
        if (req.file) fs.unlinkSync('../'+req.file.path)
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal error.',
            errdata: err
        })
    })

}

// 删除队伍
var removeTeam = function(req, res, next) {
     // 校验
     if (!req.body.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong post format'
        })
    }
    // 删除对应队长的队伍
    Team.delete_team(req.body.team_id, req.session.openid)
    .then(function(result){
        return res.status(200).json({
            code: 200,
            msg: '[Success] Delete successfully.'
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
    if (!req.query.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    // 校验是否为队伍创建人

    Team.get_token_leader(req.query.team_id, req.session.openid)
    .then(function(result) {
        console.log("result", result)
        // 检查是否为空
        if (result[0] && result[0].join_token) {
            // 检查旧的是否过期
            var date = new Date()
            var token_date = new Date(Buffer(result[0].join_token, 'base64').toString())
            if ((date - token_date) < config.invite_token_ttl) {
                return res.status(200).json({
                    code: 200,
                    msg: '[Success] Get link successfully',
                    data: 'https://itraining.zhanzy.xyz/api/v1/team/join?token='+result[0].join_token+
                    '&team_id='+req.query.team_id.toString()
                })
            }
        }
        // 更新token
        return Team.update_token(req.query.team_id, req.session.openid)
        .then(function(new_token) {
            console.log("new_token", new_token)
            // 更新
            if (new_token) {
		return res.status(200).json({
        	    code: 200,
                    msg: '[Success] Get link successfully',
                    data: 'https://itraining.zhanzy.xyz/api/v1/team/join?token='+new_token+
                    '&team_id='+req.query.team_id.toString()
                })
            }
            return res.status(403).json({
                code: 403,
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

// 点击链接加入队伍
var joinTeam = function(req, res, next) {
    // 校验token team_id存在性
    if (!req.query.token || !req.query.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    Team.get_token(req.query.team_id)
    .then(function(result) {
        console.log(result)
        if (result[0] && req.query.token === result[0].join_token) { 
            // 校验日期是否合法
            var token_date = new Date(Buffer(result[0].join_token, 'base64').toString())
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
        return res.status(403).json({
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

// 获取对应队伍队员
var getMember = function(req, res, next) {
    // 校验格式
    req.query.team_id = Number(req.query.team_id)
    if (!req.query.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    
    // 校验是否属于该队伍
    Team.get(req.session.openid, 'joined')
    .then(function(result) {
        for (var index = 0; index < result.length; index++) {
            if (result[index].team_id === req.query.team_id) {
                // 获取队员
                return User.get_joined(req.query.team_id)
                .then(function(result) {
                    return res.status(200).json({
                        code: 200,
                        msg: '[Success] Get joined member',
                        data: result
                    })
                })
            }
        }
        return res.status(403).json({
            errcode: 403,
            errmsg: '[Error] You are not in this team'
        })
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal error',
            errdata: err
        })
    })
}

// 移出某位队员
var removeMember = function(req, res, next) {
    // 校验格式
    req.body.team_id = Number(req.body.team_id)
    req.body.wx_id = Number(req.body.wx_id)
    if (!req.body.wx_id || !req.body.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    Team.delete_member(req.body.team_id, req.body.wx_id, req.session.openid)
    .then(function(result) {
        return res.status(200).json({
            code: 200,
            msg: '[Success] Remove successfully.'
        })
    })
    .catch(function(err) {
        console.log(err)
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal error',
            errdata: err
        })
    })
    
}


module.exports={
    createNewTeam: createNewTeam,
    getTeams: getTeams,
    updateTeam: updateTeam,
    removeTeam: removeTeam,
    getInvitationLink: getInvitationLink,
    joinTeam: joinTeam,
    getMember: getMember,
    removeMember: removeMember
}
