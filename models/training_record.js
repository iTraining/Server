var db = require('./db')

var select_sql = 'SELECT * FROM training_record WHERE schedule_id=?'

var insert_sql = 'INSERT INTO training_record ('+
                'group_number, record_class, '+
                'data1, data2, data3, data4, '+
                'meta_id, schedule_id, wx_id) '+
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
var insert_sql_ = 'INSERT INTO training_record (group_number, record_class,'+
                    ' data1, data2, data3, data4, meta_id, schedule_id) VALUES '
module.exports = {
    // 获取训练记录从数据库
    get: (schedule_id) => {
        return db.queryDb(select_sql, [schedule_id])
    },
    // 创建训练记录到数据库
    create: (group_number, record_class, data1, data2, data3, data4,  meta_id, schedule_id, wx_id) => {
        return db.queryDb(insert_sql, [group_number, record_class, data1, data2, data3, data4,  meta_id, schedule_id, wx_id])
    },
    create_indicators: (indicators, schedule_id) => {
        var record_class = '指标'
        var insert_indicators_sql = insert_sql_
        data = []
        for (var index = 0; index < indicators.length; index++) {
            data.push(indicators[index].group_number)
            data.push(record_class)
            data.push(indicators[index].data1)
            data.push(indicators[index].data2)
            data.push(indicators[index].data3)
            data.push(indicators[index].data4)
            data.push(indicators[index].meta_id)
            data.push(schedule_id)
            insert_indicators_sql += '(?, ?, ?, ?, ?, ?, ?, ?)'
            if (index !== indicators.length-1) {
                insert_indicators_sql += ', '
            }
        }
        return db.queryDb(insert_indicators_sql, data)
    }
}