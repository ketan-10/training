package xo_gen

import (
	"github.com/google/wire"
)

var NewRepositorySet = wire.NewSet(
    {{ range . }}
        repo.New{{ camelCase .Table.TableName }}Repository,
        rlts.New{{ camelCase .Table.TableName }}RltsRepository,
    {{- end }}
)