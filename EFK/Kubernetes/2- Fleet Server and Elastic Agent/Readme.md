# How to Install and Configure Fleet and Elastic Agent


## Operaor Install
``` bash
# Install CRD
kubectl create -f https://download.elastic.co/downloads/eck/2.16.1/crds.yaml

# rbac
kubectl apply -f https://download.elastic.co/downloads/eck/2.16.1/operator.yaml

# check
kubectl get po -n elastic-system

# logs
kubectl -n elastic-system logs -f statefulset.apps/elastic-operator

```

## Install pv
``` bash
# Install
kubectl apply -f pv.yaml

# check
kubectl get pv 
kubectl get pvc

```

## Install elastic,kibana,fleet and agent
``` bash
# apply
kubectl apply -f fleet-agent.yaml

# check
kubectl get po

# checking svc 
kubectl get svc

```

## Creating Ingress for KIBANA UI
``` bash
# Install
kubectl apply -f ingress.yaml

# secret
PASSWORD=$(kubectl get secret elasticsearch-quickstart-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')
echo $PASSWORD

# adding hosts
echo "ingress-address-ip> kibana.example.com" | sudo tee -a /etc/hosts
echo "192.168.1.200 kibana.example.com" | sudo tee -a /etc/hosts

```

## 
``` bash


```


## Referance
``` bash


```