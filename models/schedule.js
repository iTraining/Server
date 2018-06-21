var db = require('./db')

var select_created_sql = 'SELECT * FROM schedule WHERE wx_id=? AND team_id=?'
var select_schedule_sql =  'SELECT schedule.*, training_check.check, training_check.check_date, training_check.description'+
                        ' FROM schedule, training_check WHERE schedule.schedule_id=training_check.schedule_id AND training_check.wx_id=?'
var select_one_sql = 'SELECT * FROM schedule WHERE schedule_id=?'

var select_id_sql = 'SELECT * FROM schedule WHERE schedule_id=?'
var insert_team_sql = 'INSERT INTO schedule (title, description, training_date, training_class, state, team_id, wx_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
module.exports = {
    // 获取schedule从数据库
    get_created: (wx_id, team_id) => {
        return db.queryDb(select_created_sql, [wx_id, team_id])
    },
    get_schedule: (wx_id) => {
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
