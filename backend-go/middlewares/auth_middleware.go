package middlewares

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal/context_manager"
	"github.com/ketan-10/training/backend/services"
)

type GraphqlAuthenticateMiddleware struct {
	services.IAuthService
}

var NewGraphqlAuthenticateMiddleware = wire.Struct(new(GraphqlAuthenticateMiddleware), "*")

func (hm *GraphqlAuthenticateMiddleware) Handle(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {

	token, err := context_manager.GetTokenContext(ctx)
	if err != nil {
		return nil, errors.New("unauthorized Token not provided")
	}

	claim, err := hm.IAuthService.ParseToken(token)
	if err != nil {
		return nil, errors.New("invalid Token")
	}

	context_manager.WithUserClaim(ctx, &claim)

	return next(ctx)
}
