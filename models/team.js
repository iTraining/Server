// Create new team (?, ?, ?) => (team.name, team.bio, wx_id)
var db = require('./db')

var insert_sql = 'INSERT INTO team (name, bio, leader_id, image_url) VALUES (?, ?, ?, ?);'
var insert_join_sql = 'INSERT INTO join_info (wx_id, team_id) VALUES (?, ?);'

var select_all_sql = 'SELECT * FROM team'
var select_joined_sql = 'SELECT * FROM team INNER JOIN join_info WHERE join_info.wx_id = ? AND join_info.team_id = team.team_id'
var select_created_sql = 'SELECT * FROM team WHERE team.leader_id = ?'
var select_one_sql = 'SELECT * FROM team WHERE team_id=?'

var update_team_sql = 'UPDATE team SET name=?, bio=?, image_url=? WHERE team_id=? AND leader_id=?'
var delete_team_sql = 'DELETE FROM team WHERE team_id=? AND leader_id=?'

var select_token_leader_sql = 'SELECT join_token FROM team WHERE team_id=? AND leader_id=?'
var update_invite_token_sql = 'UPDATE team SET join_token=? WHERE team_id=? AND leader_id=?'
var select_token_sql = 'SELECT join_token FROM team WHERE team_id=?'
var delete_member_sql = 'DELETE FROM join_info INNER JOIN team WHERE join_info.team_id=team.team_id AND team_id=? AND join_info.wx_id=? AND team.leader_id=?'


module.exports = {
    // 创建新队伍
    create: function(name, bio, leader_id, image_url) {
        var team_id;
        return db.queryDb(insert_sql, [name, bio, leader_id, image_url])
        .then(function (result) {
            team_id = result.insertId
            return db.queryDb(insert_join_sql, [leader_id, team_id])
        }).then(function (result) {
            return db.queryDb(select_one_sql, team_id)
        })
    },
    update_team: function(team_id, leader_id, name, bio, image_url) {
        return db.queryDb(update_team_sql, [name, bio, image_url, team_id, leader_id])
    },
    delete_team: function(team_id, leader_id) {
        return db.queryDb(delete_team_sql, [team_id, leader_id])
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
    get_token_leader: function(team_id, leader_id) {
        return db.queryDb(select_token_leader_sql, [team_id, leader_id])
    },
    get_token: function(team_id) {
        return db.queryDb(select_joined_sql, [team_id])
    },
    update_token: function(team_id, leader_id) {
        var token = Buffer(new Date().toString()).toString('base64')
        return db.queryDb(update_invite_token_sql, [token, team_id, leader_id])
        .then(function(result) {
            if (result.affectedRows)
		        return token
	        return undefined
        })
    },
    create_join: function(wx_id, team_id) {
        return db.queryDb(insert_join_sql, [wx_id, team_id])
    },
    delete_member: function(team_id, wx_id, leader_id) {
        return db.queryDb(delete_member_sql, [team_id, wx_id, leader_id])
    }
}
