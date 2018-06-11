ar db = require('./db')

var insert_sql = 'INSERT INTO check (wx_id, schedule_id) VALUES (?, ?)'
module.exports = {
    // 获取user从数据库
    get: (wx_id) => {
        // TODO
        // return db.queryDb(select_sql, [wx_id])
    },
    // 创建user到数据库
    create: (wx_id, schedule_id) => {
        return db.queryDb(insert_sql, [wx_id, schedule_id])
    } 
}