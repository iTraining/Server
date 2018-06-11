ar db = require('./db')

var insert_sql = 'INSERT INTO training_record ('+
                'training_id, group_number, record_class, '+
                'data1, data2, data3, data4, '+
                'meta_id, schedule_id, wx_id) '+
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
module.exports = {
    // 获取训练记录从数据库
    get: (wx_id) => {
        // TODO
        // return db.queryDb(select_sql, [wx_id])
    },
    // 创建训练记录到数据库
    create: (training_id, group_number, record_class, data1, data2, data3, data4,  meta_id, schedule_id, wx_id) => {
        return db.queryDb(insert_sql, [training_id, group_number, record_class, data1, data2, data3, data4,  meta_id, schedule_id, wx_id])
    } 
}