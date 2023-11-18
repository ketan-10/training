module github.com/ketan-10/classroom/backend

replace github.com/ketan-10/classroom/xo => ../xo

go 1.16

require (
	github.com/99designs/gqlgen v0.17.40
	github.com/elgris/sqrl v0.0.0-20210727210741-7e0198b30236
	github.com/go-chi/chi/v5 v5.0.8
	github.com/go-sql-driver/mysql v1.7.1
	github.com/golang-jwt/jwt/v4 v4.5.0
	github.com/google/wire v0.5.0
	github.com/jmoiron/sqlx v1.3.5
	github.com/ketan-10/classroom/xo v0.0.0-20231118191112-21db31b4a50f
	github.com/ketan-10/go-fanout v0.0.0-20230916194735-2137f7766ae3
	github.com/pkg/errors v0.9.1
	github.com/pressly/goose/v3 v3.16.0
	github.com/vektah/gqlparser/v2 v2.5.10

)
