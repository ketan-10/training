{{ range .Enums}}
  {{ camelCase .Enum.ColumnName }}:
    model: {{ camelCase .Enum.ColumnName }}
{{ end }}

{{ range .Tables}}
  {{ camelCase .TableName }}:
    model: {{ camelCase .TableName }}
{{ end }}