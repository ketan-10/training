{{ range .Enums}}
scalar {{ camelCase .Enum.ColumnName }}
{{ end }}

