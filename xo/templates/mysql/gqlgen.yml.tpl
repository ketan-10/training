{{ range .Enums}}
{{- $name := joinWith "_" .Enum.TableName .Enum.ColumnName -}}
{{ camelCase $name }}:
  model: {{ camelCase $name }}
{{ end }}

{{ range .Tables}}
{{- camelCase .TableName }}:
  model: {{ camelCase .TableName }}
{{ end }}