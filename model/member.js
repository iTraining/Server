var select_sql = 'SELECT * FROM member WHERE wx_id=?'
var insert_sql = 'INSERT INTO member (wx_id) VALUES (?)'
var db = require('../db')
module.exports = {
    // 获取member从数据库
    get: (req, value) => {
        // Get an user with openid(wxid) and make token in redis
        // Database operation.
        var selector = db.operator(select_sql, value, function(err, result) {
            if (err) {
                console.log('[Error] ', err)
            }
            return value
        })
        return req.getConnection()
    },
    // 创建member到数据库
    create: (req, value) => {
        // create an user with openid(wxid) and make token in redis
        // Database operation.
        var inserter = db.operator(insert_sql, value, function(err, result) {
            if (err) {
                console.log('[Warning] Duplicate number.')
            }
            return value
        })
        return req.getConnection(inserter)
    } 
}