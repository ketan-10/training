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

    # bin/goose_linux -dir ${dir} mysql "${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true" up
    echo "Hey"
    # echo "bin/goose_linux -dir ${dir} mysql \"${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true\" up"
    # bin/goose_linux -dir migrations mysql "bob:qweqwe@tcp(127.0.0.1:3306)/skoolnet2?charset=utf8mb4&parseTime=true" up
    # echo "${binary} -dir ${dir} mysql \"${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true\" up"
    ${binary} -dir ${dir} mysql "${MYSQL_USER}:${MYSQL_PASSWORD}@tcp(127.0.0.1:3306)/${database}?charset=utf8mb4&parseTime=true" up
}

cleanMigrate() {
    echo ${MYSQL_PASSWORD}
    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'DROP DATABASE ${MYSQL_DATABASE};'"
    docker exec -i db bash -c "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e 'CREATE DATABASE ${MYSQL_DATABASE} CHARSET=utf8mb4;'"
    runMigration ${MYSQL_DATABASE}
}

if [[ $1 = 'migrate' ]]; then
    cleanMigrate
else
    echo "Usage Not found"
    exit 2
fi
