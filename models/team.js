// Create new team (?, ?, ?) => (team.name, team.bio, wx_id)
var db = require('./db')

var insert_sql = 'INSERT INTO team (name, bio, leader_id) VALUES (?, ?, ?); '+
                'INSERT INTO join_info (wx_id, team_id) VALUES (?, (SELECT @@IDENTITY));'

var select_all_sql = 'SELECT * FROM team'

var select_joined_sql = 'SELECT * FROM team WHERE join_info.wx_id = ? AND join_info.id = team.leader_id'

var select_created_sql = 'SELECT * FROM team WHERE team.leader_id = ?'

exports.Team = {
    // 创建新队伍
    create: function(name, bio, leader_id) {
        db.queryDb(insert_sql, [name, bio, leader_id, leader_id])
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