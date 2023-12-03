source ./docker/docker.env

runMigration() {
    
    if [[ -z $1 ]]; then
        echo "database required"
        exit 2
    fi
    database=$1
    
    dir=migrations
    if [[ $2 ]]; then
        dir=$2
    fi

    # ${binary} -dir ${dir} mysql "${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true" up
    go run github.com/pressly/goose/v3/cmd/goose -dir ${dir} mysql "${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true" up
}

cleanMigrate() {
    echo "re-creating database and running db migration with goose on migration folder..."

    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'DROP DATABASE ${MYSQL_DATABASE};'"
    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'CREATE DATABASE ${MYSQL_DATABASE} CHARSET=utf8mb4;'"
    runMigration ${MYSQL_DATABASE}
    
    echo "Migration complete."
}

xo() {
    echo "Running xo..."
    # https://stackoverflow.com/questions/58403134/go-permission-denied-when-trying-to-create-a-file-in-a-newly-created-directory
    # chmod 666 -R xo_gen xo_gen/enum xo_gen/table xo_gen/repo xo_gen/schema xo_gen/rlts
    find ./xo_gen ! -type d -delete

    connection=$(echo "mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}?charset=utf8mb4&parseTime=true" | tr -d '\r')
    echo $connection
    go run ./cmd/xo/main.go --connection="$connection"

    echo "xo completed."
}

# if gqlgen folder is empty goimports will fail for 'xo_resolver.go' please manually import gen from ./graphql/gen 
goimports() {
    echo "Running goimports..."
    go run github.com/ketan-10/go-fanout --command="go run golang.org/x/tools/cmd/goimports -w" --chunk=5 -- xo_gen/enum/*
    go run github.com/ketan-10/go-fanout --command="go run golang.org/x/tools/cmd/goimports -w" --chunk=5 -- xo_gen/table/*
    go run github.com/ketan-10/go-fanout --command="go run golang.org/x/tools/cmd/goimports -w" --chunk=5 -- xo_gen/repo/*
    go run github.com/ketan-10/go-fanout --command="go run golang.org/x/tools/cmd/goimports -w" --chunk=5 -- xo_gen/rlts/*
    go run github.com/ketan-10/go-fanout --command="go run golang.org/x/tools/cmd/goimports -w" --chunk=5 -- xo_gen/*.go
    echo "goimports completed"
}

yaml_graphql() {
    (echo "# Code generated by do.sh DO NOT EDIT."; cat graphql/gqlgen-header.yml; cat xo_gen/gqlgen.yml) > graphql/gqlgen.yml
}

gqlgen() {
    echo "Running gqlgen..."
    (cd graphql && go run github.com/99designs/gqlgen gen)
    echo "gqlgen completed"
}

wire() {
    echo "Running wire..."
    go run github.com/google/wire/cmd/wire ./wire_app
    echo "wire completed"
}

if [[ $1 = 'migrate' ]]; then
    runMigration ${MYSQL_DATABASE}  
elif [[ $1 = 'cleanMigrate' ]]; then
    cleanMigrate
elif [[ $1 = 'xo' ]]; then
    xo
elif [[ $1 = 'goimports' ]]; then
    goimports
elif [[ $1 = 'yaml_graphql' ]]; then
    yaml_graphql 
elif [[ $1 = 'gqlgen' ]]; then 
    gqlgen
elif [[ $1 = 'wire' ]]; then
    wire
elif [[ $1 = 'all' ]]; then
    cleanMigrate
    xo
    goimports
    yaml_graphql
    gqlgen
    wire
else
    echo "mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}?charset=utf8mb4&parseTime=true"
    echo "Usage Not found"
    exit 2
fi
