package main

import (
	"context"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	_ "github.com/go-sql-driver/mysql" // empty import, to load drivers
	"github.com/ketan-10/classroom/backend/graphql/gen"
	"github.com/ketan-10/classroom/backend/internal/context_manager"
	"github.com/ketan-10/classroom/backend/wire_app"
)

func main() {
	port := "8080"

	ctx := context_manager.WithConnection(context.Background(), "bob:password@tcp(127.0.0.1:3306)/classroom?charset=utf8mb4&parseTime=true")

	app, _, err := wire_app.GetApp(ctx)

	if err != nil {
		panic(err)
	}

	c := gen.Config{Resolvers: app.Resolver}
	c.Directives.Authenticate = app.GraphqlAuthenticateMiddleware.Handle

	srv := handler.NewDefaultServer(gen.NewExecutableSchema(c))

	router := chi.NewRouter()
	router.Use(app.HeaderMiddleware.Handle)

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))

}
