var db = require('./db')

var select_sql = 'SELECT * FROM user WHERE wx_id=?'
var insert_sql = 'INSERT INTO user (wx_id, nickname, image_url) VALUES (?, ?, ?)'
var update_sql = 'UPDATE user SET nickname=?, image_url=? WHERE wx_id=?'
module.exports = {
    // 获取user从数据库
    get: (wx_id) => {
        // Get an user with openid(wxid) and make token in redis
        // Database operation.\
        return db.queryDb(select_sql, [wx_id])
    },
    // 创建user到数据库
    create: (wx_id, nickname, image_url) => {
        // create an user with openid(wxid) and make token in redis
        // Database operation.
        return db.queryDb(insert_sql, [wx_id, nickname, image_url])
    },
    update: (wx_id, nickname, image_url) => {
        return db.queryDb(update_sql, [nickname, image_url, wx_id])
    }
}
