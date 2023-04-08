package xo_gen

import (
	"github.com/google/wire"
)


type XoResolver struct {
{{ range . }}
    repo.I{{ camelCase .Table.TableName }}Repository
    rlts.I{{ camelCase .Table.TableName }}RltsRepository
{{- end }}
}

//type IXoResolver interface {
    {{- range . }}
//    {{ camelCase .Table.TableName }}() gen.{{ camelCase .Table.TableName }}Resolver
    {{- end}}
//}

var NewXoResolver = wire.NewSet(
    wire.Struct(new(XoResolver), "*"),
//    wire.Bind(new(IXoResolver), new(XoResolver)),
)

{{ range . }}
func (r *XoResolver) {{ camelCase .Table.TableName }}() gen.{{ camelCase .Table.TableName }}Resolver {
	return r.I{{ camelCase .Table.TableName }}RltsRepository
}
{{- end }}
