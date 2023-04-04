package internal

import (
	"fmt"
	"strings"

	"github.com/ketan-10/classroom/xo/loaders/models"
	"github.com/ketan-10/classroom/xo/templates"
	"github.com/ketan-10/classroom/xo/utils"
)

// The loader interface
type ILoader interface {
	LoadSchema(*Args) error
}

var AllLoaders = map[LoaderType]ILoader{}

// The loader implementation
// Drivers like mysql will create object for this.
type LoaderImp struct {
	EnumList        func(db models.XODB, databaseName string) ([]*models.Enum, error)
	DatabaseName    func(db models.XODB) (string, error)
	EnumValueList   func(db models.XODB, databaseName string, tableName string, columnName string) (string, error)
	TableList       func(db models.XODB, databaseName string) ([]string, error)
	ColumList       func(db models.XODB, databaseName string, tableName string) ([]*models.Column, error)
	IndexList       func(db models.XODB, databaseName string, tableName string) ([]*models.Index, error)
	ForeignKeysList func(db models.XODB, databaseName string, tableName string) ([]*models.ForeignKey, error)
}

// Entry point to load everything
func (lt *LoaderImp) LoadSchema(args *Args) error {
	var err error

	database, err := lt.loadDatabaseName(args)
	if err != nil {
		return err
	}
	args.DatabaseName = database

	allEnumDTO, err := lt.loadEnums(args)
	if err != nil {
		return err
	}

	tables, err := lt.loadTables(args)
	if err != nil {
		return err
	}

	tableRelations, err := lt.loadRelations(args, tables)
	if err != nil {
		return err
	}

	// execute enum
	for _, enum := range allEnumDTO {
		err := args.ExecuteTemplate(templates.ENUM, fmt.Sprintf("%s_%s", enum.TableName, enum.ColumnName), enum)
		if err != nil {
			return err
		}
	}
	
	// execute Table 
	for _, tableRelation := range tableRelations {
		err := args.ExecuteTemplate(templates.TABLE, tableRelation.Table.TableName, tableRelation)
		if err != nil {
			return err
		}
	}

	// execute repos
	for _, tableRelation := range tableRelations {
		err = args.ExecuteTemplate(templates.REPO, tableRelation.Table.TableName+"_repository", tableRelation)
		if err != nil {
			return err
		}
	}

	// execute wire.go
	err = args.ExecuteTemplate(templates.XO_WIRE, "wire.xo", tableRelations)
	if err != nil {
		return err
	}

	return nil
}

func (lt *LoaderImp) loadDatabaseName(args *Args) (string, error) {
	if lt.DatabaseName == nil {
		return "", fmt.Errorf("schema name loader is not implemented for %s", args.LoaderType.String())
	}
	return lt.DatabaseName(args.DB)
}


func (lt *LoaderImp) loadRelations(args *Args, tables []*models.TableDTO) ([]*models.TableRelation, error) {

	res := []*models.TableRelation{}

	for _, table := range tables {
		indexes, err := lt.IndexList(args.DB, args.DatabaseName, table.TableName)

		all_indexes := utils.ExpandIndex(indexes)
		// add column details to index for ease of use
		utils.AttachColumnDetailsToIndex(all_indexes, table)
		
		if err != nil {
			return nil, err
		}
		foreignKeys, err := lt.ForeignKeysList(args.DB, args.DatabaseName, table.TableName)
		if err != nil {
			return nil, err
		}
		tableRelation := &models.TableRelation{
			Table:       table,
			Indexes:     indexes,
			ForeignKeys: foreignKeys,
		}
		
		res = append(res, tableRelation)
	}
	return res, nil
}


func (lt *LoaderImp) loadTables(args *Args) ([]*models.TableDTO, error) {
	tables, err := lt.TableList(args.DB, args.DatabaseName)
	if err != nil {
		return nil, err
	}
	var allTableDTO []*models.TableDTO

	for _, table := range tables {
		columns, err := lt.ColumList(args.DB, args.DatabaseName, table)
		if err != nil {
			return nil, err
		}
		allTableDTO = append(allTableDTO, &models.TableDTO{
			TableName: table,
			Columns:   columns,
		})
	}
	return allTableDTO, nil
}


func (lt *LoaderImp) loadEnums(args *Args) ([]*models.EnumDTO, error) {
	enums, err := lt.EnumList(args.DB, args.DatabaseName)
	if err != nil {
		return nil, err
	}

	var allEnumDTO []*models.EnumDTO
	for _, e := range enums {
		// fmt.Printf("%s, %s \n", e.ColumnName, e.TableName)
		enumValues, err := lt.loadEnumValues(args, e)

		if err != nil {
			return nil, err
		}

		allEnumDTO = append(allEnumDTO, &models.EnumDTO{
			Enum: e,
			DatabaseName: args.DatabaseName,
			Values: enumValues,
		})
	}
	return allEnumDTO, nil
}

func (lt *LoaderImp) loadEnumValues(args *Args, enum *models.Enum) ([]string, error) {
	if lt.EnumValueList == nil {
		return nil, fmt.Errorf("enumValue loader is not implemented for %s", args.LoaderType.String())
	}

	values, err := lt.EnumValueList(args.DB, args.DatabaseName, enum.TableName, enum.ColumnName)

	if err != nil {
		return nil, err
	}
	// value is in 'A','B','C' we want to convert to a list
	list := strings.Split(values[1:len(values)-1], "','")
	return list, nil
}
