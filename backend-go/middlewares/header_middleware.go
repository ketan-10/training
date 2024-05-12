package middlewares

import (
	"net/http"
	"strings"

	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal/context_manager"
)

type HeaderMiddleware struct {
}

var NewHeaderMiddleware = wire.Struct(new(HeaderMiddleware), "*")

// func (hm *HeaderMiddleware) Handle(ctx context.Context, next graphql.Resolver) (res interface{}, err error) {
func (hm *HeaderMiddleware) Handle(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		token := strings.Replace(r.Header.Get("Authorization"), "Bearer ", "", -1)
		ctx = context_manager.WithToken(ctx, token)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
