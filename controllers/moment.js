var Punch = require('../models/training_punch')
var Reference = require('../models/training_reference')

// 获取动态信息
var getMomentInformation = function(req, res, next) {
    // 校验表单
    if (!req.query.b_date || !req.query.e_date) {
        return res.status(400).json({
            errcode: 400, 
            errmsg: '[Error] Wrong query format'
        })
    }
    Punch.get_moment(req.session.openid, req.query.b_date, req.query.e_date)
    .then(function(result) {
        var moment_list = result

        // 获取reference 信息
        var schedule_id_list = [] 
        var id_map = {}
        for (let index = 0; index < moment_list.length; index++) {
            moment_list[index].references = []
            schedule_id_list.push(moment_list[index].schedule_id)
            id_map[schedule_id_list[index]] = index
        }
        // 获取相应的references
        if (moment_list.length) {
            return Reference.get_by_schedule(schedule_id_list)
                .then(function(result) {
                    for (let index = 0; index < result.length; index++) {
                        let sch_ind = id_map[result[index].schedule_id]
                        moment_list[sch_ind].references.push(result[index])
                    }
                    res.status(200).json({
                        code: 200,
                        msg: '[Success] Get moments successfully',
                        data: moment_list
                    })
                })
        }
        return res.status(200).json({
            code: 200,
            msg: '[Success] Get moments in successfully',
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
