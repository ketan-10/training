registoryPath=us-central1-docker.pkg.dev/elite-firefly-401018/internal-repo/static-fe-image:$1

docker buildx build --platform linux/amd64 -t $registoryPath .
docker push $registoryPath
