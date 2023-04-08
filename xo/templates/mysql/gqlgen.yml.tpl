{{ range .Enums}}
{{- $name := joinWith "_" .Enum.TableName .Enum.ColumnName -}}
{{ camelCase $name }}:
  model: enum.{{ camelCase $name }}
{{ end }}

{{ range .Tables}}
{{- camelCase .TableName }}:
  model: table.{{ camelCase .TableName }}
{{ camelCase .TableName }}Create:
  model: table.{{ camelCase .TableName }}Create
{{ camelCase .TableName }}Filter:
  model: table.{{ camelCase .TableName }}Filter
{{ camelCase .TableName }}Update:
  model: table.{{ camelCase .TableName }}Update
List{{ camelCase .TableName }}:
  model: table.List{{ camelCase .TableName }}

{{ end }}