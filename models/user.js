var db = require('./db')

var select_sql = 'SELECT * FROM member WHERE wx_id=?'
var insert_sql = 'INSERT INTO member (wx_id) VALUES (?)'
module.exports = {
    // 获取member从数据库
    get: (req, wx_id) => {
        // Get an user with openid(wxid) and make token in redis
        // Database operation.\
        return db.queryDb(select_sql, [wx_id])
    },
    // 创建member到数据库
    create: (req, wx_id) => {
        // create an user with openid(wxid) and make token in redis
        // Database operation.
        return db.queryDb(insert_sql, wx_id)
    } 
}
