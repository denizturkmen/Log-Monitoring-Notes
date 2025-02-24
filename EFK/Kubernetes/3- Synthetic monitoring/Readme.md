# How to Install and Configure Synthetic Monitoring on the Elasticsearch


## Step_1: CA 
``` bash
# Navigate to Elasticsearch Directory
cd /usr/share/elasticsearch

# Generate the CA Certificate and Private Key
sudo bin/elasticsearch-certutil ca

# enter enter no password

```


## Step_2: CA certificate (--ca-cert) and the CA private key (--ca-key) for Elasticsearch
``` bash
# Navigate to Elasticsearch Directory
cd /usr/share/elasticsearch

# Generate the CA Certificate and Private Key
sudo bin/elasticsearch-certutil ca --pem

# list: ll and elastic-stack-ca.zip
unzip elastic-stack-ca.zip

```


## Certs for fleet server
``` bash
# command template
/usr/share/elasticsearch/bin/elasticsearch-certutil cert \
  --out /root/fleet.zip \
  --name fleet \
  --ca-cert <path to your ca cert> \
  --ca-key <path to your ca key> \
  --dns fleet.evermight.net
  --pem

---
# go to /usr/share/elasticsearch/bin/
/usr/share/elasticsearch/bin/elasticsearch-certutil cert \
  --out /root/fleet.zip \
  --name fleet \
  --ca-cert /etc/elasticsearch/certs/ca.crt \
  --ca-key /etc/elasticsearch/certs/ca.key \
  --dns fleet.evermight.net
  --pem


```



## Install fleet: Prodcution on the Kibana UI
``` bash
# be careful: 

# Install command
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.17.1-amd64.deb
sudo dpkg -i elastic-agent-8.17.1-amd64.deb
sudo systemctl enable elastic-agent
sudo systemctl start elastic-agent
sudo elastic-agent enroll --url=https://192.168.1.40:8220 \
  --fleet-server-es=https://192.168.1.40:9200 \
  --fleet-server-service-token=AAEAAWVsYXN0aWMvZmxlZXQtc2VydmVyL3Rva2VuLTE3Mzk4ODkzMzg0MTk6MDQyQzhsWnlTc1dFdmd6enNTUFVjZw \
  --fleet-server-policy=fleet-server-policy \
  --fleet-server-es-ca-trusted-fingerprint=613822d302a00d4ec5521ca1dd17b3d1e603b36c878e00148604c3add9a9157a \
  --certificate-authorities=<PATH_TO_CA> \
  --fleet-server-cert=<PATH_TO_FLEET_SERVER_CERT> \
  --fleet-server-cert-key=<PATH_TO_FLEET_SERVER_CERT_KEY> \
  --fleet-server-port=8220

---

curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.17.1-amd64.deb
sudo dpkg -i elastic-agent-8.17.1-amd64.deb
sudo systemctl enable elastic-agent
sudo systemctl start elastic-agent
sudo elastic-agent enroll --url=https://192.168.1.40:8220 \
  --fleet-server-es=https://192.168.1.40:9200 \
  --fleet-server-service-token=AAEAAWVsYXN0aWMvZmxlZXQtc2VydmVyL3Rva2VuLTE3Mzk4ODU3MDYyMzE6SExZdnRtTUNTcnVMRXdZdmFvZVhmUQ \
  --fleet-server-policy=fleet-server-policy \
  --fleet-server-es-ca-trusted-fingerprint=613822d302a00d4ec5521ca1dd17b3d1e603b36c878e00148604c3add9a9157a \
  --certificate-authorities=/etc/elasticsearch/certs/ca.crt \
  --fleet-server-cert=<PATH_TO_FLEET_SERVER_CERT> \
  --fleet-server-cert-key=<PATH_TO_FLEET_SERVER_CERT_KEY> \
  --fleet-server-port=8220


```

##
``` bash



```



