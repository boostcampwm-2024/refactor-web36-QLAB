$status = & minikube status --format="{{.Host}}"
if ($status -eq "Running") {
    Write-Host "Minikube is already running."
} else {
    & minikube start
}

& minikube docker-env | Invoke-Expression
docker build -t local-qlab-apiserver -f ./BE/Dockerfile .
docker build -t local-qlab-webserver -f ./FE/Dockerfile .

kubectl delete -f ./kubernetes/apiServer-deployment.yaml
kubectl delete -f ./kubernetes/webServer-deployment.yaml
kubectl apply -f ./kubernetes/
