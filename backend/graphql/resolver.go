package graphql

import (
	"github.com/ketan-10/classroom/backend/graphql/gen"
	"github.com/ketan-10/classroom/backend/xo_gen"
)

type Resolver struct {
	xo_gen.XoResolver
}

func (r *Resolver) Query() gen.QueryResolver {
	return r
}
