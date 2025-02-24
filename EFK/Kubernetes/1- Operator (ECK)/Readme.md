# How to Install and Configure Elasticsearch with OPERATOR


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

## Creating PV
``` bash
# Create pv
kubectl apply -f pv.yaml

# List
kubecttl get pv 

# Permission
sudo mkdir -p /mnt/data/elasticsearch
sudo chmod -R 777 /mnt/data/elasticsearch

```


# Own certificate
``` bash
# 1. Generate a Self-Signed CA Certificate (Optional)
openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=my-ca"

# 2. Generate a Private Key and CSR for the Certificate
openssl genrsa -out tls.key 2048
openssl req -new -key tls.key -out tls.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=my-elasticsearch"

#3. Sign the Certificate with the CA
openssl x509 -req -in tls.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out tls.crt -days 365 -sha256

# 4. Create the Kubernetes Secret
kubectl create secret generic elastic-tls \
  --from-file=tls.crt=tls.crt \
  --from-file=tls.key=tls.key \
  --from-file=ca.crt=ca.crt \
  --namespace <your-namespace>

```

## Install Elasticsearch
``` bash
# Install
kubectl apply -f elasticsearch.yaml

# Check
PASSWORD=$(kubectl get secret quickstart-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')
kubectl port-forward service/quickstart-es-http 9200
curl -u "elastic:$PASSWORD" -k "http://localhost:9200"
or
curl -u "elastic:$PASSWORD" -k "https://localhost:9200"

# Secret
kubectl get secret -n elastic-system elasticsearch-es-elastic-user -o=jsonpath=’{.data.elastic}’ | base64 — decode; echo

```


## Installating KIBANA
``` bash
# Install
kubectl apply -f kibana.yaml

# checking
kubectl get kibana
or
kubectl get pod --selector='kibana.k8s.elastic.co/name=quickstart'

# port-forward
kubectl get service quickstart-kb-http
kubectl port-forward service/quickstart-kb-http 5601

# curl command
curl -u "elastic:$PASSWORD" -k "http://localhost:5601"
or
curl -u "elastic:$PASSWORD" -k "https://localhost:5601"



```



## Creating Ingress for KIBANA UI
``` bash
# Install
kubectl apply -f ingress.yaml

# adding hosts
echo "ingress-address-ip> kibana.example.com" | sudo tee -a /etc/hosts
echo "192.168.1.200       kibana.example.com" | sudo tee -a /etc/hosts

```


## Referance
``` bash
# tls
https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-tls-certificates.html#k8s-setting-up-your-own-certificate


```
