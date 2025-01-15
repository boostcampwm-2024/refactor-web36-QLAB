#!/bin/bash

status=$(minikube status --format='{{.Host}}')
if [ "$status" == "Running" ]; then
    echo "Minikube is already running."
else
    minikube start
fi

eval $(minikube docker-env)
docker build -t local-qlab-apiserver -f ./BE/Dockerfile .
docker build -t local-qlab-webserver -f ./FE/Dockerfile .

kubectl delete -f ./kubernetes/apiServer-deployment.yaml
kubectl delete -f ./kubernetes/webServer-deployment.yaml
kubectl apply -f ./kubernetes/