//go:build wireinject
// +build wireinject

package wire_app

import (
	"context"

	"github.com/google/wire"
	"github.com/ketan-10/classroom/backend/graphql"
	"github.com/ketan-10/classroom/backend/internal"
	"github.com/ketan-10/classroom/backend/xo_gen"
)

// To inject all patch to App
// This will allow calls to InitPatch method
// and we can also we can directly call run method of individual patch

type App struct {
	Resolver *graphql.Resolver
}

var globalSet = wire.NewSet(
	xo_gen.NewRepositorySet,
	xo_gen.NewXoResolver,
	wire.Struct(new(App), "*"),
	wire.Struct(new(graphql.Resolver), "*"),
	internal.NewDB,
)

func GetApp(ctx context.Context) (*App, func(), error) {
	wire.Build(globalSet)
	return &App{}, nil, nil
}
