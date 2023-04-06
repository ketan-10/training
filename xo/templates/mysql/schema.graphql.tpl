{{- $tableNameCamel := camelCase .Table.TableName -}}


type {{ $tableNameCamel }} {
{{- range .Table.Columns}}
    {{ camelCaseVar .ColumnName }}: {{.GraphQLType}}{{- if .NotNullable }}!{{- end }}
{{- end }}

{{/* ManyToOne */}}
{{- range .ForeignKeys }}
    {{ camelCaseVar .RefTableName }}By{{ camelCase .ColumnName }}(filter: {{ camelCase .RefTableName }}Filter): {{ camelCase .RefTableName }} @filterModifier(from: "{{ $.Table.TableName }}")
{{- end }}


{{/* OneToMany */}}
{{- range .ForeignKeysRef }}
    {{ camelCaseVar .Table.TableName }}By{{ camelCase .ColumnName }}(filter: {{ camelCase .Table.TableName }}Filter, pagination: Pagination): List{{ camelCase .Table.TableName }}! @filterModifier(from: "{{ $.Table.TableName }}")
{{- end }}

{{- range $k, $v := .GraphQLIncludeFields }}
    {{$k}}{{$v}}
{{- end }}
}
input {{ $tableNameCamel }}Filter {
{{- range .Table.Columns }}
    {{ camelCaseVar .ColumnName }}: FilterOnField
{{- end }}
}

input {{ $tableNameCamel }}Create {
{{- range .Table.Columns}}
    {{- if and (eq .IsGenerated false) (ne .ColumnName "id") (ne .ColumnName "created_at") (ne .ColumnName "updated_at") (ne .ColumnName "active")}}
    {{ camelCaseVar .ColumnName }}: {{.GraphQLType}}{{- if .NotNullable }}!{{- end }}
    {{- end}}
{{- end }}
}

input {{ $tableNameCamel }}Update {
{{- range .Table.Columns}}
    {{- if and (eq .IsGenerated false) (ne .ColumnName "id") (ne .ColumnName "created_at") (ne .ColumnName "updated_at") }}
    {{ camelCaseVar .ColumnName }}: {{.GraphQLType}}
    {{- end}}
{{- end }}

}

type List{{ $tableNameCamel }} {
    totalCount: Int!
    data: [{{ $tableNameCamel }}!]!
}
