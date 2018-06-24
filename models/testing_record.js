var db = require('./db')

var insert_sql = 'INSERT INTO testing_record, '+
        ' (reference_id, group_id, data, wx_id) VALUES (?, ?, ?, ?)'

var select_private_sql = 'SELECT testing_record.*, schedule.schedule_id FROM testing_record, training_reference, schedule '+
        'WHERE testing_record.references_id=training_reference.reference_id AND training_reference.schedule_id=schedule.schedule_id '+
        'AND testing_record.wx_id=? AND training_reference.schedule_id LIKE ? AND schedule.team_id LIKE ? '+
        'AND testing_record.date >= ? AND testing_record.date < ?'
var select_team_sql = 'SELECT testing_record.*, schedule.schedule_id FROM testing_record, training_reference, schedule '+
        'WHERE testing_record.references_id=training_reference.reference_id AND training_reference.schedule_id=schedule.schedule_id '+
        'AND schedule.wx_id=? AND training_reference.schedule_id LIKE ? AND schedule.team_id LIKE ? '+
        'AND testing_record.date >= ? AND testing_record.date < ?'
module.exports = {
    // 上传新的record
    create: (reference_id, group_id, data, wx_id) => {
        return db.queryDb(insert_sql, [eference_id, group_id, data, wx_id])
        .then(function(result) {
            return db.queryDb('SELECT * FROM testing_record WHERE meta_id=?', [result.insertId])
        })
    },
    // 获取个人成绩
    get_private: (wx_id, schedule_id, team_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        if (schedule_id === -1) schedule_id = '%'
        return db.queryDb(select_private_sql, [wx_id, schedule_id, team_id, b_date, e_date])
    },
    // 获取队伍成绩
    get_team: (wx_id, schedule_id, team_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        if (schedule_id === -1) schedule_id = '%'
        return db.queryDb(select_team_sql, [wx_id, schedule_id, team_id, b_date, e_date])
    }

}