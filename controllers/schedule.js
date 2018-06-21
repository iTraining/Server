var Team = require('../models/team')
var Schedule = require('../models/schedule')
var Record = require('../models/training_record')
var Check = require('../models/training_check')
var User = require('../models/user')

// 创建队伍训练计划
/**
 * POST:
 * training_class: 训练|测试
 * team_id
 * description
 * title
 * training_date: YY-MM-DD
 * state: 草稿|发布
 * indicators: [
 *   {group_number, data1, data2, data3, data4, meta_id},
 *   {group_number, ....}
 * ]
 * members: [
 *  wx_id1, wx_id2, ...
 * ]
 * 
 * 
 */
var createTeamSchedule = function(req, res, next) {
    // 校验表单
    if (!req.body.training_class || !req.body.team_id || !req.body.description || !req.body.title 
        || !req.body.training_date || !req.body.indicators || !req.body.members || !req.body.state) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    
    // 校验是否为leader
    Team.get_one(req.body.team_id)
    .then(function(result) {
        // 不存在队伍
        if (!result[0]) {
            return res.status(403).json({
                errcode: 403,
                errmsg: '[Error] The team is not exist'
            })
        }
        // 存在队伍
        if (result[0].leader_id == req.session.openid) {
            // 校验成功，创建schedule
            return Schedule.create_for_team(req.body.title, req.body.description, req.body.training_date, req.body.training_class, req.body.state,
            req.body.team_id, req.session.openid,)
            .then(function(result){
                var schedule = result[0]

                // 批量插入指标到record
                return Record.create_indicators(req.body.indicators, schedule.schedule_id)
                .then(function(result){
                    schedule.indicators = req.body.indicators

                    // 批量插入对应队员的打卡名单
                    return Check.create(req.body.members, schedule.schedule_id)
                    .then(function(result) {
                        schedule.members = req.body.members
                        return res.status(201).json({
                            code: 201,
                            msg: '[Success] Create schedule successfully!',
                            data: schedule
                        })
                    })
                })
            })
        }
        else {
            return res.status(403).json({
                errcode: 403,
                errmsg: '[Error] You are no leader of team'
            })
        }
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


// 创建个人训练计划
/**
 * POST:
 * description
 * title
 * indicators: [
 *   {group_number, data1, data2, data3, data4, record_class, meta_id},
 *   {group_number, ....}
 * ]
 * members: [
 *  wx_id1, wx_id2, ...
 * ]
 * 
 * 
 */
var createPrivateSchedule = function(req, res, next) {
    // 个人训练计划默认 training_class为测试
    // 校验表单
    if (!req.body.description || !req.body.title || !req,body.training || !req.body.members) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    // TODO:
}

// 获取创建的训练计划列表（简要信息，不包含训练项目等）
var getCreatedSchedulesBrief = function(req, res, next) {
    // 校验表单
    if (!req.query.team_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    Schedule.get_created(req.session.openid, req.query.team_id)
    .then(function(result) {
        return res.status(200).json({
            code: 200,
            msg: '[Success] Get created team schedule successfully',
            data: result
        })
    })
    .catch(function(err) {
        res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal err',
            errdata: err
        })
    })
}

// 获取打卡计划列表（简要信息，不包含训练项目等）
var getSchedulesBrief = function(req, res, next) {
    Schedule.get_schedule(req.session.openid)
    .then(function(result) {
        res.status(200).json({
            code: 200,
            msg: '[Success] Get schedules successfully',
            data: result
        })
    })
    .catch(function(err) {
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal err',
            errdata: err
        })
    })

}

// 获取训练计划中间件
var getSchedules = function(req, res, next) {
    // 校验表单
    if (req.query.option === 'created')
        getCreatedSchedulesBrief(req, res, next)
    else if (req.query.option === 'me')
        getSchedulesBrief(req, res, next)
    else {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
}

// 获取详细训练计划项目
var getScheduleDetail = function(req, res, next) {
    // 校验表单
    if (!req.query.schedule_id) {
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query format'
        })
    }
    Schedule.get_one(req.query.schedule_id)
    .then(function(result) {
        var schedule = result[0]
        if (schedule) {
            Record.get(req.query.schedule_id)
            .then(function(result) {
                schedule.indicators = result
                
                // 获取对队员id
                return Check.get_wxid(req.query.schedule_id)
                .then(function(result) {

                    // 获取队员信息
                    return User.get_list(result)
                    .then(function(result) {
                        schedule.members = result;
                        return res.status(200).json({
                            code: 200,
                            msg: '[Success] Get schedule detail successfully',
                            data, schedule
                        })
                    })
                })
            })
        }
        else {
            return res.status(200).json({
                code: 200,
                msg: '[Success] Get schedule successfully',
                data: schedule
            })
        }
    })
    .catch(function(err) {
        return res.status(500).json({
            errcode: 500,
            errmsg: '[Error] Internal err',
            errdata: err
        })
    })
}

module.exports = {
    createTeamSchedule: createTeamSchedule,
    getSchedules: getSchedules,
    getScheduleDetail: getScheduleDetail
}