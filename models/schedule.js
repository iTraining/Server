var db = require('./db')

var select_team_sql = 'SELECT * FROM schedule WHERE team_id=?'
var select_created_sql = 'SELECT * FROM schedule WHERE wx_id=?'
var insert_sql = 'INSERT INTO schedule (title, description, training_class, team_id, wx_id) VALUES (?, ?, ?, ?, ?)'
module.exports = {
    // 获取schedule从数据库
    get: (wx_id) => {
        // TODO
        // return db.queryDb(select_sql, [wx_id])
    },
    // 创建schedule到数据库
    create: (title, description, training_class, team_id, wx_id) => {
        return db.queryDb(insert_sql, [title, description, training_class, team_id, wx_id])
    } 
}
