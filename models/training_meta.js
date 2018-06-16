var db = require('./db')

var select_sql = 'SELECT * FROM training_meta WHERE team_id=?'
var insert_sql = 'INSERT INTO training_meta (training_name, index1, index2, index3, index4, team_id) VALUES (?, ?, ?, ?, ?, ?)'
module.exports = {
    // 获取对应队伍的training meta
    get: (team_id) => {
        return db.queryDb(select_sql, [team_id])
    },
    // 创建新training meta
    create: (training_name, index1, index2, index3, index4, team_id) => {
        return db.queryDb(insert_sql, [training_name, index1, index2, index3, index4, team_id])
        .then(function(result) {
            return db.queryDb('SELECT * FROM training_meta WHERE meta_id=?', [result.insertId])
        })
    } 
}
