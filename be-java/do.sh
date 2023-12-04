run() {
    mvn spring-boot:run
}

build() {
    mvn clean package
}

if [[ $1 = 'run' ]]; then
    run
elif [[ $1 = 'build' ]]; then
    build
else
    echo "Usage Not found"
    exit 2
fi