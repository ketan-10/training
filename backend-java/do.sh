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
elif [[ $1 == 'docker' ]]; then
    # https://stackoverflow.com/questions/75089403/docker-exec-usr-local-openjdk-11-bin-java-exec-format-error
    docker buildx build --platform linux/amd64 -t backend-image . 
    registoryPath=us-central1-docker.pkg.dev/elite-firefly-401018/internal-repo/backend-image:$2
    docker tag backend-image $registoryPath
    docker push $registoryPath
else
    echo "Usage Not found"
    exit 2
fi
