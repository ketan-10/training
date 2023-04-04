package utils

import "github.com/ketan-10/classroom/xo/loaders/models"

// --> input
// {
// 	name: "hello"
// 	id: 1,
// 	unique: true,
// 	columns: [
// 		{name: col1, no: 1},
// 		{name: col1, no: 2},
// 		{name: col1, no: 3},
// 	]
// }

// -- output
// {
// 	name: "hello"
// 	id: 1,
// 	unique: true,
// 	columns: [
// 		{name: col1, no: 1},
// 		{name: col1, no: 2},
// 		{name: col1, no: 3},
// 	]
// }
// {
// 	name: "hello"
// 	id: 1,
// 	unique: true,
// 	columns: [
// 		{name: col1, no: 1},
// 	]
// }
// {
// 	name: "hello"
// 	id: 1,
// 	unique: true,
// 	columns: [
// 		{name: col1, no: 1},
// 		{name: col1, no: 2},
// 	]
// }

// A multi-column index can still be effective even if you are only searching by a single column that is part of index.
// For example if you create an index on column (A, B, C). Mysql will create 3 seperate index (A), (A, B), (A, B, C)

func ExpandIndex(indexes []*models.Index) []*models.Index {
	var all_indexes []*models.Index
	for _, index := range indexes {
		all_indexes = append(all_indexes, index)

		for i := 1; i < len(index.Columns); i++ {
			new_idx := *index
			new_idx.IsUnique = false
			new_idx.Columns = Filter[*models.IndexColumn](index.Columns, func(v *models.IndexColumn) bool {
				return v.SequenceNo <= i
			})
			all_indexes = append(all_indexes, &new_idx)
		}
	}
	return all_indexes
}

func AttachColumnDetailsToIndex(indexes []*models.Index, table *models.TableDTO) {
	for _, index := range indexes {
		for _, col := range index.Columns {
			for _, tableCol := range table.Columns {
				if tableCol.ColumnName == col.ColumnName {
					col.Column = tableCol
				}
			}
		}
	}
}
