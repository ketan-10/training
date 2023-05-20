
{{- $tableNameCamel := camelCase .Table.TableName -}}
{{- $shortName := shortName $tableNameCamel -}}

package rlts

type I{{ $tableNameCamel }}RltsRepository interface {

// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
{{- range .ForeignKeys }}
    {{ camelCase .RefTableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .RefTableName }}Filter) (*table.{{ camelCase .RefTableName }}, error)
{{- end }}

//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record
{{- range .ForeignKeysRef }}
    {{ camelCase .Table.TableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .Table.TableName }}Filter, pagination *internal.Pagination) (*table.List{{ camelCase .Table.TableName }}, error)
{{- end }}

}

type {{ $tableNameCamel }}RltsRepository struct {
    
    {{- range .UniqueTablesForRepoDependency}}
        {{ camelCase . }}Repository repo.I{{ camelCase . }}Repository
    {{end}}
}


var New{{ $tableNameCamel }}RltsRepository = wire.NewSet(
    wire.Struct(new({{ $tableNameCamel }}RltsRepository), "*"),
    wire.Bind(new(I{{ $tableNameCamel }}RltsRepository), new({{ $tableNameCamel }}RltsRepository)),
)

{{- range .ForeignKeys }}
func ({{ $shortName }}r *{{ $tableNameCamel }}RltsRepository) {{ camelCase .RefTableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .RefTableName }}Filter) (*table.{{ camelCase .RefTableName }}, error) {
    if obj ==  nil {
        return nil, nil
    }

    if filter == nil {
		filter = &table.{{ camelCase .RefTableName }}Filter{}
	}

    filter.Add{{ camelCase .RefColumnName }}(internal.Eq, obj.{{ camelCase .ColumnName }})
    result, err := {{ $shortName }}r.{{camelCase .RefTableName}}Repository.FindAll{{camelCase .RefTableName}}(ctx, filter, nil)

    if err != nil {
        return nil, err
    }

    if result.TotalCount == 0 {
        return nil, nil
    }
    return &result.Data[0], nil
}
{{- end }}


{{- range .ForeignKeysRef }}
func ({{ $shortName }}r *{{ $tableNameCamel }}RltsRepository) {{ camelCase .Table.TableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .Table.TableName }}Filter, pagination *internal.Pagination) (*table.List{{ camelCase .Table.TableName }}, error) {
    if obj ==  nil {
        return &table.List{{ camelCase .Table.TableName }}{}, nil
    }
    {{- if eq .Column.GoType .RefColumn.GoType }}
        return {{ $shortName }}r.{{ camelCase .Table.TableName }}Repository.{{ camelCase .Table.TableName }}By{{ camelCase .ColumnName }}(ctx, obj.{{ camelCase .RefColumn.ColumnName }}, filter, pagination)
    {{- else }}
        return {{ $shortName }}r.{{ camelCase .Table.TableName }}Repository.{{ camelCase .Table.TableName }}By{{ camelCase .ColumnName }}(ctx, {{convertToNull (print "obj." (camelCase .RefColumn.ColumnName)) .RefColumn.GoType }}, filter, pagination)
    {{- end }}
}
{{- end }}

