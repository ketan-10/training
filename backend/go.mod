module github.com/ketan-10/classroom/backend

replace github.com/ketan-10/classroom/xo => /home/ketan/go/src/classroom/xo

go 1.18

require (
	github.com/elgris/sqrl v0.0.0-20210727210741-7e0198b30236
	github.com/go-sql-driver/mysql v1.7.0
	github.com/google/wire v0.5.0
	github.com/jmoiron/sqlx v1.3.5
	github.com/ketan-10/classroom/xo v0.0.0-00010101000000-000000000000
	github.com/pkg/errors v0.9.1
)

require (
	github.com/alexflint/go-arg v1.4.3 // indirect
	github.com/alexflint/go-scalar v1.1.0 // indirect
	github.com/kenshaw/snaker v0.2.0 // indirect
	github.com/xo/dburl v0.13.0 // indirect
)
