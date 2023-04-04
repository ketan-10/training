package models


type TableDTO struct {
	TableName string
	Columns   []*Column
}

type TableRelation struct {
	Table       *TableDTO
	Indexes     []*Index
	ForeignKeys []*ForeignKey
}

type EnumDTO struct {
	*Enum
	DatabaseName string
	Values       []string
}
