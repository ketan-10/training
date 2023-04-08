package main

import (
	"context"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/go-sql-driver/mysql" // empty import, to load drivers
	"github.com/ketan-10/classroom/backend/graphql/gen"
	"github.com/ketan-10/classroom/backend/utils"
	"github.com/ketan-10/classroom/backend/wire_app"
)

func main() {
	port := "8080"

	ctx := context.WithValue(context.Background(), utils.Connection, "bob:password@tcp(127.0.0.1:3306)/classroom?charset=utf8mb4&parseTime=true")

	// bob:password@tcp(127.0.0.1:3306)/classroom?charset=utf8mb4&parseTime=true
	app, _, err := wire_app.GetApp(ctx)

	if err != nil {
		panic(err)
	}

	srv := handler.NewDefaultServer(gen.NewExecutableSchema(gen.Config{Resolvers: app.Resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

}
