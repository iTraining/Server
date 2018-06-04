// Create new team (?, ?, ?) => (team.name, team.bio, wx_id)
var db = require('./db')

var insert_sql = 'INSERT INTO team (name, bio, leader_id) VALUES (?, ?, ?);'
var insert_join_sql = 'INSERT INTO join_info (wx_id, team_id) VALUES (?, ?);'

var select_all_sql = 'SELECT * FROM team'
var select_joined_sql = 'SELECT * FROM team INNER JOIN join_info WHEREjoin_info.wx_id = ? AND join_info.wx_id = team.leader_id'
var select_created_sql = 'SELECT * FROM team WHERE team.leader_id = ?'
var select_one_sql = 'SELECT * FROM team WHERE team_id=?'

module.exports = {
    // 创建新队伍
    create: function(name, bio, leader_id) {
        var team_id;
        return db.queryDb(insert_sql, [name, bio, leader_id])
        .then(function (result) {
            team_id = result.insertId
            return db.queryDb(insert_join_sql, [leader_id, team_id])
        }).then(function (result) {
            return db.queryDb(select_one_sql, team_id)
        })
    },
    get: function(wx_id, option='joined') {
        if (option === 'joined') {
            return db.queryDb(select_joined_sql, wx_id)
        }
        if (option === 'all') {
            return db.queryDb(select_all_sql, wx_id)
        }
        if (option === 'created') {
            return db.queryDb(select_created_sql, wx_id)
        }
    }
}