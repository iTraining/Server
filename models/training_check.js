var db = require('./db')

var select_sql = 'SELECT wx_id FROM training_check WHERE schedule_id=?'
var insert_sql_ = 'INSERT INTO training_check (wx_id, schedule_id) VALUES'
module.exports = {
    // 获取user从数据库
    get_wxid: (schedule_id) => {
        return db.queryDb(select_sql, [schedule_id])
    },
    // 创建user到数据库
    create: (wx_id_list, schedule_id) => {
        var insert_sql = insert_sql_
        data = []
        for (var index = 0; index < wx_id_list.length; index++) {
            data.push(wx_id_list[index])
            data.push(schedule_id)
            insert_sql += '(?, ?)'
            if (index !== wx_id_list.length-1) {
                insert_sql += ', '
            }
        }
        return db.queryDb(insert_sql, data)
    } 
}