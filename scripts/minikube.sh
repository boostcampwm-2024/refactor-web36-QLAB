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
docker build -t local-qlab-dbmanager -f ./DBManager/Dockerfile .

kubectl config use-context minikube
kubectl apply -k ./kubernetes/overlays/dev