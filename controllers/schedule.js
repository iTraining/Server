var Team = require('../models/team')
var Schedule = require('../models/schedule')
var Reference = require('../models/training_reference')
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
 * references: [
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
    // No member list  !req.body.members
    // 校验表单
    if (!req.body.training_class || !req.body.team_id || !req.body.description || !req.body.title 
        || !req.body.training_date || !req.body.references || !req.body.state) {
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
            req.body.team_id, req.session.openid)
            .then(function(result){
                var schedule = result[0]

                // 批量插入指标到Reference
                return Reference.create_references(req.body.references, schedule.schedule_id)
                .then(function(result){
                    schedule.references = req.body.references   
                    return res.status(201).json({
                        code: 201,
                        msg: '[Success] Create schedule successfully!',
                        data: schedule
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
 * references: [
 *   {group_number, data1, data2, data3, data4, Reference_class, meta_id},
 *   {group_number, ....}
 * ]
 * members: [
 *  wx_id1, wx_id2, ...
 * ]
 * 
 * 
 */
// var createPrivateSchedule = function(req, res, next) {
//     // 个人训练计划默认 training_class为测试
//     // 校验表单
//     if (!req.body.description || !req.body.title || !req,body.training || !req.body.members) {
//         return res.status(400).json({
//             errcode: 400,
//             errmsg: '[Error] Wrong query format'
//         })
//     }
//     // TODO:
// }

// 获取训练计划
var getSchedules = function(req, res, next) {
    // 校验表单
    if (!(req.query.option === 'created' || req.query.option === 'private')
        || !req.query.team_id || !req.query.b_date || !req.query.e_date) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong query format'
        })
    }

    // 获取
    var get_sch
    if (req.query.option === 'created') {
        // 获取已创建的计划
        get_sch = Schedule.get_created
    }
    else {
        // 获取自己队伍的计划
        get_sch = Schedule.get_schedule
    }
    req.query.team_id = Number(req.query.team_id)
    get_sch(req.query.team_id, req.session.openid, req.query.b_date, req.query.e_date)
    .then(function(result) {
        var schedule = result
        var schedule_id_list = [] 
        var id_map = {}
        for (let index = 0; index < schedule.length; index++) {
            schedule[index].references = []
            schedule_id_list.push(schedule[index].schedule_id)
            id_map[schedule[index].schedule_id] = index
        }
        // 获取相应的references
        if (schedule.length) {
	    return Reference.get_by_schedule(schedule_id_list)
            .then(function(result) {
                for (let index = 0; index < result.length; index++) {
                    let sch_ind = id_map[result[index].schedule_id]
                    schedule[sch_ind].references.push(result[index])
                }
                res.status(200).json({
                    code: 200,
                    msg: '[Success] Get schedule successfully',
                    data: schedule
                })
            })
	}
	else {
	    res.status(200).json({
		code: 200,
		msg: '[Success] Get schedule successfully',
		data: schedule
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

module.exports = {
    createTeamSchedule: createTeamSchedule,
    getSchedules: getSchedules
}
