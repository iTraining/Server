var db = require('./db')

var select_private_sql = 'SELECT * FROM training_punch INNER JOIN schedule WHERE training_punch.wx_id=? '+
                            'AND schedule.team_id LIKE ? AND training_punch.schedule_id LIKE ? '+
                            'AND training_punch.punch.date >= ? AND training_punch.punch.date < ?'
var select_team_sql = 'SELECT * FROM training_punch INNER JOIN schedule WHERE schedule.wx_id=? '+
                            'AND schedule.team_id LIKE ? AND training_punch.schedule_id LIKE ? '+
                            'AND training_punch.punch.date >= ? AND training_punch.punch.date < ?'
var select_momment_sql =  'SELECT traing_punch.*, user.nickname, user.image_url '+
                        'FROM training_punch, user INNER JOIN schedule WHERE schedule.wx_id=? '+
                        'AND schedule.team_id LIKE ? AND training_punch.schedule_id LIKE ? '+
                        'AND training_punch.punch.date >= ? AND training_punch.punch.date < ?'
var insert_sql = 'INSERT INTO training_punch (wx_id, schedule_id, completion, image_url) VALUES (?, ?, ?, ?)'
module.exports = {
    // 获取user从数据库
    get_private: (wx_id, team_id, schedule_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        if (schedule_id === -1) schedule_id = '%'
        return db.queryDb(select_private_sql, [wx_id, team_id, schedule_id, b_date, e_date])
    },
    get_team: (wx_id, team_id, schedule_id, b_date, e_date) => {
        if (team_id === -1) team_id = '%'
        if (schedule_id === -1) schedule_id = '%'
        return db.queryDb(select_team_sql, [wx_id, team_id, schedule_id, b_date, e_date])
    },
    // 创建user到数据库
    create: (wx_id, schedule_id, completion, image_url) => {
        return db.queryDb(insert_sql, [wx_id, schedule_id, completion, image_url])
        .then(function(result) {
            return db.queryDb('SELECT * FROM training_punch WHERE meta_id=?', [result.insertId])
        })
    } 
}