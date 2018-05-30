// Create new team (?, ?, ?) => (team.name, team.bio, wx_id)
var db = require('../db')

var insert_sql = 'INSERT INTO team (name, bio) VALUES (?, ?); INSERT INTO join_info (wx_id, team_id) VALUES (?, (SELECT @@IDENTITY));'


module.exports = {
    // 创建新队伍
    insert_sql: insert_sql
}