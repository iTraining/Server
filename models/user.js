var db = require('./db')

var select_sql = 'SELECT * FROM user WHERE wx_id=?'
var insert_sql = 'INSERT INTO user (wx_id) VALUES (?)'
module.exports = {
    // 获取user从数据库
    get: (wx_id) => {
        // Get an user with openid(wxid) and make token in redis
        // Database operation.\
        return db.queryDb(select_sql, [wx_id])
    },
    // 创建user到数据库
    create: (wx_id) => {
        // create an user with openid(wxid) and make token in redis
        // Database operation.
        return db.queryDb(insert_sql, wx_id)
    } 
}
