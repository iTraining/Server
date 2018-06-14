// Create new team (?, ?, ?) => (team.name, team.bio, wx_id)
var db = require('./db')

var insert_sql = 'INSERT INTO team (name, bio, leader_id) VALUES (?, ?, ?);'
var insert_join_sql = 'INSERT INTO join_info (wx_id, team_id) VALUES (?, ?);'

var select_all_sql = 'SELECT * FROM team'
var select_joined_sql = 'SELECT * FROM team INNER JOIN join_info WHERE join_info.wx_id = ? AND join_info.team_id = team.team_id'
var select_created_sql = 'SELECT * FROM team WHERE team.leader_id = ?'
var select_one_sql = 'SELECT * FROM team WHERE team_id=?'
var select_token_sql = 'SELECT join_token FROM team WHERE team_id=? AND leader_id=?'
var update_invite_token_sql = 'UPDATE team SET join_token=? WHERE team_id=? AND leader_id=?'

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
    get_one: function(team_id) {
        return db.queryDb(select_one_sql, [team_id])
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
    },
    get_token: function(team_id, leader_id) {
        return db.queryDb(select_token_sql, [team_id, leader_id])
    },
    update_token: function(team_id, leader_id) {
	console.log('token='+token)
        return db.queryDb(update_invite_token_sql, [token, team_id, leader_id])
        .then(function(result) {
            if (result.affectedRows)
		        return token
	        return undefined
        })
    },
    create_join: function(wx_id, team_id) {
        return db.queryDb(insert_join_sql, [wx_id, team_id])
    }
}
