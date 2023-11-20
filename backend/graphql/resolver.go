package graphql

import (
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/graphql/gen"
	"github.com/ketan-10/training/backend/services"
	"github.com/ketan-10/training/backend/xo_gen"
)

var NewServiceSet = wire.NewSet(
	services.NewAuthService,
)

type Resolver struct {
	xo_gen.XoResolver
	services.IAuthService
}

func (r *Resolver) Query() gen.QueryResolver {
	return r
}

func (r *Resolver) Mutation() gen.MutationResolver {
	return r
}
