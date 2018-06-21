var db = require('./db')

var select_sql = 'SELECT * FROM user WHERE wx_id=?'
var select_list_sql_ = 'SELECT * FROM user WHERE wx_id IN '
var insert_sql = 'INSERT INTO user (wx_id, nickname, image_url) VALUES (?, ?, ?)'
var update_sql = 'UPDATE user SET nickname=?, image_url=? WHERE wx_id=?'
var select_joined_sql = 'SELECT * FROM user INNER JOIN join_info WHERE join_info.team_id = ? AND join_info.wx_id = user.wx_id'

module.exports = {
    // 获取user从数据库
    get: (wx_id) => {
        // Get an user with openid(wxid) and make token in redis
        // Database operation.\
        return db.queryDb(select_sql, [wx_id])
    },
    get_list: (wxid_list) => {
        var select_list_sql = select_list_sql_ + '(';
        for (var index=0; index < wxid_list.length; index++) {
            select_list_sql += String(wxid_list[index])
            if (index != wxid_list.length-1)
                select_list_sql += ', '
        }
        select_list_sql += ')';
        return db.queryDb(select_list_sql, []);
    },
    // 创建user到数据库
    create: (wx_id, nickname, image_url) => {
        // create an user with openid(wxid) and make token in redis
        // Database operation.
        return db.queryDb(insert_sql, [wx_id, nickname, image_url])
    },
    update: (wx_id, nickname, image_url) => {
        return db.queryDb(update_sql, [nickname, image_url, wx_id])
    },
    get_joined: (team_id) => {
        return db.queryDb(select_joined_sql, [team_id]);
    }
}
