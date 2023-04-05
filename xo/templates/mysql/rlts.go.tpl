
{{- $tableNameCamel := camelCase .Table.TableName -}}
{{- $shortName := shortName $tableNameCamel -}}

package rlts

type I{{ $tableNameCamel }}RltsRepository interface {
{{/* ManyToOne */}}
{{- range .ForeignKeys }}
{{/* which table foreign pointing to */}}
    {{ camelCaseVar .RefTableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .RefTableName }}Filter) (*table.{{ camelCase .RefTableName }}, error)
{{- end }}

{{/* OneToMany */}}
{{- range .ForeignKeysRef }}
{{/* On which table the Foreign key is on */}}
    {{ camelCaseVar .Table.TableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .Table.TableName }}Filter, pagination *internal.Pagination) (*table.List{{ $tableNameCamel }}, error)
{{- end }}

}

type {{ $tableNameCamel }}RltsRepository struct {
    {{- range .ForeignKeys}}
        {{ camelCase .RefTableName }}Repository repo.I{{ camelCase .RefTableName }}Repository
    {{end}}
    {{- range .ForeignKeysRef}}
        {{ camelCase .Table.TableName }}Repository repo.I{{ camelCase .Table.TableName }}Repository
    {{end}}
}

{{- range .ForeignKeys }}
func ({{ $shortName }}r *{{ $tableNameCamel }}RltsRepository) {{ camelCaseVar .RefTableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *table.{{ $tableNameCamel }}, filter *table.{{ camelCase .RefTableName }}Filter) (*table.{{ camelCase .RefTableName }}, error) {
    if obj ==  nil {
        return nil, nil
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
func ({{ $shortName }}r *{{ $tableNameCamel }}RltsRepository) {{ camelCaseVar .Table.TableName }}By{{ camelCase .ColumnName }}(ctx context.Context, obj *entities.{{ $tableNameCamel }}, filter *entities.{{ camelCase .Table.TableName }}Filter, pagination *entities.Pagination) (*entities.List{{ $tableNameCamel }}, error) {
    if obj ==  nil {
        return table.List{{ $tableNameCamel }}{}, nil
    }
    {{- if eq .Column.GoType .RefColumn.GoType }}
    return {{ $shortName }}r.{{ camelCase .RefTableName }}Repository.{{ camelCase .RefTableName }}By{{ camelCase .RefColumnName }}(ctx, obj.{{ camelCase .RefColumn.ColumnName }}, filter, pagination)
    {{- else }}
    return {{ $shortName }}r.{{ camelCase .RefTableName }}Repository.{{ camelCase .RefTableName }}By{{ camelCase .RefColumnName }}(ctx, {{convertToNull (print "obj." (camelCase .RefColumn.ColumnName)) (camelCase .RefColumn.GoType)}}, filter, pagination)
    {{- end }}
}
{{- end }}

