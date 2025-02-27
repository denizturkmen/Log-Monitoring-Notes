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
# pull
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.17.2

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

# curl command
curl -u "elastic:$PASSWORD" -k "http://localhost:5601"
or
curl -u "elastic:$PASSWORD" -k "https://localhost:5601"

curl -u "elastic:$PASSWORD" -k "http://localhost:9200"
curl -u "elastic:$PASSWORD" -k "https://localhost:9200"

# adding hosts
echo "ingress-address-ip> kibana.example.com" | sudo tee -a /etc/hosts
echo "192.168.1.200 kibana.example.com" | sudo tee -a /etc/hosts

```

## Test
``` bash
# Exec 
kubectl exec -it elastic-agent-quickstart-agent-vs9cf -- /bin/bash

# install
apt update && apt install -y curl vim
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# directory
cd /usr/share/elastic-agent
mkdir -p tests

# go to 
cd /usr/share/elastic-agent
npm init -y
vim synthetic.spec.ts
npm install --save-dev @playwright/test
npx playwright install
npx playwright --version

npx playwright install-deps
npx playwright test

apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxcb1 \
    libxkbcommon0

```


## Referance
``` bash
docker run \
  --env FLEET_ENROLL=1 \
  --env FLEET_URL= https://fleet-server-quickstart-agent-http.default.svc:8220 \
  --env FLEET_ENROLLMENT_TOKEN=ZHgwZFE1VUI2dEV6QzViN0xsbWI6Nk92TTQ2bFBRMm1UZUk1TTYzNlV0Zw== \
  --cap-add=NET_RAW \
  --cap-add=SETUID \
  --rm docker.elastic.co/elastic-agent/elastic-agent-complete:8.17.2

apiVersion: apps/v1
kind: Deployment
metadata:
  name: elastic-agent
  namespace: default
  labels:
    app: elastic-agent
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elastic-agent
  template:
    metadata:
      labels:
        app: elastic-agent
    spec:
      containers:
        - name: elastic-agent
          image: docker.elastic.co/elastic-agent/elastic-agent-complete:8.17.2
          env:
            - name: FLEET_ENROLL
              value: "1"
            - name: FLEET_URL
              value: "https://fleet-server-quickstart-agent-http.default.svc:8220" # Replace with your actual Fleet URL
            - name: FLEET_ENROLLMENT_TOKEN
              value: "ZHgwZFE1VUI2dEV6QzViN0xsbWI6Nk92TTQ2bFBRMm1UZUk1TTYzNlV0Zw==" # Replace with your actual token
          securityContext:
            capabilities:
              add:
                - NET_RAW
                - SETUID
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
            requests:
              cpu: "250m"
              memory: "256Mi"
      restartPolicy: Always



```