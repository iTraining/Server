var db = require('./db')

var select_created_sql = 'SELECT * FROM schedule WHERE wx_id=? AND team_id LIKE ? AND training_date >= ? AND training_date < ? '
var select_schedule_sql =  'SELECT * FROM schedule INNER JOIN join_info '+
                            'WHERE schedule.team_id=join_info.team_id AND join_info.team_id LIKE ? AND join_info.wx_id=? '+
                            'AND schedule.training_date >= ? AND schedule.training_date < ?'
var select_one_sql = 'SELECT * FROM schedule WHERE schedule_id=?'

var select_id_sql = 'SELECT * FROM schedule WHERE schedule_id=?'
var insert_team_sql = 'INSERT INTO schedule (title, description, training_date, training_class, state, team_id, wx_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
module.exports = {
    // 获取schedule从数据库
    get_created: (wx_id, team_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        return db.queryDb(select_created_sql, [wx_id, team_id, b_date, e_date])
    },
    get_schedule: (team_id, wx_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        return db.queryDb(select_schedule_sql, [wx_id])
    },
    // 创建schedule到数据库
    create_for_team: (title, description, training_date, training_class, state, team_id, wx_id) => {
        return db.queryDb(insert_team_sql, [title, description, training_date, training_class, state, team_id, wx_id])
        .then(function(result){
            return db.queryDb(select_id_sql, [result.insertId])
        })
    },
    get_one: (schedule_id) => {
        return db.queryDb(select_one_sql, [schedule_id])
    }
}
