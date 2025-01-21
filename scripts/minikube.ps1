$status = & minikube status --format="{{.Host}}"
if ($status -eq "Running") {
    Write-Host "Minikube is already running."
} else {
    & minikube start
}

& minikube docker-env | Invoke-Expression
docker build -t local-qlab-apiserver -f ./BE/Dockerfile .
docker build -t local-qlab-webserver -f ./FE/Dockerfile .
docker build -t local-qlab-dbmanager -f ./DBManager/Dockerfile .

kubectl config use-context minikube
kubectl apply -k ./kubernetes/overlays/dev