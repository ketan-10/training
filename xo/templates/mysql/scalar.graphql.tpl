{{ range .Enums}}
{{- $name := joinWith "_" .Enum.TableName .Enum.ColumnName -}}
scalar {{ camelCase $name }}
{{ end }}