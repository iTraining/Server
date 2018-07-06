var db = require('./db')

var select_sql_ = 'SELECT * FROM training_reference WHERE schedule_id IN '

var select_with_meta_sql_ = 'SELECT * FROM training_reference, training_meta '+
                    'WHERE training_reference.meta_id=training_meta.meta_id AND training_reference.schedule_id IN '

var insert_sql_ = 'INSERT INTO training_reference (group_number,'+
                    ' data1, data2, data3, data4, data5, data6, test_index, meta_id, schedule_id) VALUES '
module.exports = {
    // 获取训练记录从数据库
    get_by_schedule: (schedule_id_list) => {
        var select_sql = select_sql_ + '('
        for (var index = 0; index < schedule_id_list.length; index++) {
            select_sql += String(schedule_id_list[index])
            if (index != schedule_id_list.length-1) select_sql += ', '
        }
        select_sql += ')'
        return db.queryDb(select_sql, [])
    },
    get_with_meta_by_schedule: (schedule_id_list) => {
	var select_with_meta_sql = select_with_meta_sql_ + '('
        for (var index = 0; index < schedule_id_list.length; index++) {
            select_with_meta_sql += String(schedule_id_list[index])
            if (index != schedule_id_list.length-1) select_with_meta_sql += ', '
        }
        select_with_meta_sql += ')'
        return db.queryDb(select_with_meta_sql, [])
    },
    create_references: (references, schedule_id) => {
        var insert_references_sql = insert_sql_
        data = []
        for (var index = 0; index < references.length; index++) {
            data.push(references[index].group_number)
            data.push(references[index].data1)
            data.push(references[index].data2)
            data.push(references[index].data3)
            data.push(references[index].data4)
            data.push(references[index].data5)
            data.push(references[index].data6)
            data.push(references[index].test_index)
            data.push(references[index].meta_id)
            data.push(schedule_id)
            insert_references_sql += '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            if (index !== references.length-1) {
                insert_references_sql += ', '
            }
        }
        return db.queryDb(insert_references_sql, data)
    }
}
