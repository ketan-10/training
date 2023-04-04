source ./docker/docker.env

runMigration() {
    echo "running migration"
    
    if [[ -z $1 ]]; then
        echo "database required"
        exit 2
    fi
    database=$1
    
    dir=migrations
    binary="bin/goose_linux"
    if [[ $2 ]]; then
        dir=$2
    fi

    ${binary} -dir ${dir} mysql "${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true" up
}

cleanMigrate() {
    echo ${MYSQL_PASSWORD}
    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'DROP DATABASE ${MYSQL_DATABASE};'"
    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'CREATE DATABASE ${MYSQL_DATABASE} CHARSET=utf8mb4;'"
    runMigration ${MYSQL_DATABASE}
}


xo() {
    # https://stackoverflow.com/questions/58403134/go-permission-denied-when-trying-to-create-a-file-in-a-newly-created-directory
    rm -rf xo_gen
    mkdir xo_gen xo_gen/enum xo_gen/table xo_gen/repo xo_gen/xo_wire xo_gen/schema
    chmod 0777 -R xo_gen xo_gen/enum xo_gen/table xo_gen/repo xo_gen/xo_wire xo_gen/schema

    connection=$(echo "mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}?charset=utf8mb4&parseTime=true" | tr -d '\r')
    go run ./tools/xo/main.go --connection="$connection"
}

if [[ $1 = 'migrate' ]]; then
    cleanMigrate
elif [[ $1 = 'xo' ]]; then
    xo
elif [[ $1 = 'goimports' ]]; then
    ~/go/bin/go-fanout --command="/home/ketan/go/bin/goimports -w" --chunk=5 -- xo_gen/enum/*
    ~/go/bin/go-fanout --command="/home/ketan/go/bin/goimports -w" --chunk=5 -- xo_gen/table/*
    ~/go/bin/go-fanout --command="/home/ketan/go/bin/goimports -w" --chunk=5 -- xo_gen/repo/*
    ~/go/bin/go-fanout --command="/home/ketan/go/bin/goimports -w" --chunk=5 -- xo_gen/xo_wire/*
elif [[ $1 = 'wire' ]]; then
    /home/ketan/go/bin/wire ./wire_app
else
    echo "mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@127.0.0.1:3306/${MYSQL_DATABASE}?charset=utf8mb4&parseTime=true"
    # mysql://bob:password@127.0.0.1:3306/classroom?charset=utf8mb4&parseTime=true
    # go run main.go "mysql://bob:qweqwe@127.0.0.1:3306/skoolnet2?charset=utf8mb4&parseTime=true" --entities-pkg=gen
    # go run main.go "mysql://bob:password@127.0.0.1:3306/classroom?charset=utf8mb4&parseTime=true" --entities-pkg=gen
    echo "Usage Not found"
    exit 2
fi

