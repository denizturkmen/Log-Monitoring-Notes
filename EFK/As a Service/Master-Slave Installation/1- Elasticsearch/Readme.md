# Master-Slave ElasticSearch Installation and Configuration Guide

Elasticsearch: Step by step

1- Java install

2- Elasticsearch install

3- Elasticsearch must password

4- Elasticsearck must be created certificate


Elasticsearch Component;

Indice

Type

Document

Field

Full Text Search

Index

Mapping

Cluster

Node

Shard

Replica




Set hostname on each node like below
``` bash
 192.168.1 40 -> sudo hostnamectl set-hostname elk-master-1
 192.168.1 41 -> sudo hostnamectl set-hostname elk-node-1

```

Installation Overview
``` bash
Server_1        192.168.1.40        java11 + elasticsearch + kibana + elastic APM 
Server_2        192.168.1.41        java11 + elasticsearch

```

Add your nodes info in **/etc/hosts** file like below
``` bash
sudo vim /etc/hosts

 192.168.1.40       elk-master-1
 192.168.1.41       elk-node-1

```

Java must install all **elk node**
``` bash
# install
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y 
sudo apt install -y openjdk-11-jdk	

# check version
java -version
javac -version

# export java version
export PATH=$PATH:$JAVA_HOME/bin

```

Elasticsearch install all elk master and slave node.
``` bash
# dowland gpg-key 
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

# save the repository definition to /etc/apt/sources.list.d/elastic-8.x.list
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# install latest version
sudo apt update
sudo apt install -y elasticsearch

# install a specific version
sudo apt install apt-transport-https
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.9.0-amd64.deb
sudo dpkg -i elasticsearch-8.9.0-amd64.deb

```

Elasticsearch install with script
``` bash
# root
sudo su -

# install
curl https://raw.githubusercontent.com/denizturkmen/Log-Monitoring-Notes/main/EFK/As%20a%20Service/Master-Slave%20Installation/1-%20Elasticsearch/elastic-install.sh | bash 

```

Elasticsearch service start,enable and restart all elk node. but elasticsearch **must be started**.
``` bash
# enable
sudo systemctl enable elasticsearch

# start
sudo systemctl start elasticsearch

# status
sudo systemctl status elasticsearch

# restart
sudo systemctl restart elasticsearch

```

**X-pack** enable on master and data node, but elasticsearch 8.x is comes automatically so it's needn't this step.
``` bash
# root
sudo su

# go to related directory
cd /etc/elasticsearch

# Edit elasticsearch.yml
vim elasticsearch.yml
  
  xpack.security.enabled: true
  xpack.security.transport.ssl.enabled: true

```

Configuration elasticsearch.yml on elk **master node**. Cluster name, node,name etc
``` bash
# root
sudo su

# go to elastic file
cd /etc/elasticsearch

# edit yaml
vim elasticsearch.yml
    cluster.name: elk-production
    node.name: elk-master-1
    node.roles: [ master, data ]
    path.data: /var/lib/elasticsearch
    path.logs: /var/log/elasticsearch
    bootstrap.memory_lock: true
    network.host: 192.168.1.40
    http.port: 9200
    discovery.seed_hosts: ["elk-master-1", "elk-node-1"]
    cluster.initial_master_nodes: ["elk-master-1"]
    xpack.security.enabled: true
    xpack.security.enrollment.enabled: true
    xpack.security.http.ssl:
      enabled: true
      keystore.path: certs/http.p12
    xpack.security.transport.ssl:
      enabled: true
      verification_mode: certificate
      keystore.path: certs/transport.p12
      truststore.path: certs/transport.p12

```

Disable Memory Swapping on master and data node
``` bash
# root 
sudo su

# You therefore need to ensure that memory locking is enabled on the Elasticsearch service level. This can be done as follows;

[[ -d /etc/systemd/system/elasticsearch.service.d ]] || mkdir /etc/systemd/system/elasticsearch.service.d
echo -e '[Service]\nLimitMEMLOCK=infinity' > \
/etc/systemd/system/elasticsearch.service.d/override.conf

# Whenever a systemd service is modified, you need to reload the systemd configurations.
systemctl daemon-reload

# One of the recommended ways to disable swapping is to completely disable swap if Elasticsearch is the only service running on the server.
swapoff -a

#Edit the /etc/fstab file and comment out any lines that contain the word swap;
sed -i.bak '/swap/s/^/#/' /etc/fstab

#Otherwise, disable swappiness in the kernel configuration;
echo 'vm.swappiness=1' >> /etc/sysctl.conf
sysctl -p

```


Set JVM Heap Size on master and data node
``` bash
# Elasticsearch sets the heap size to 1GB by default. As a rule of thump, set Xmx to no more than **50%** of your physical RAM but not more than **32GB**. Any custom JVM settings should be placed under /etc/elasticsearch/jvm.options.d.

# checking memory
free -h

echo -e "-Xms2g\n-Xmx2g" > /etc/elasticsearch/jvm.options.d/jvm.options

# Set the maximum number of open files for the elasticsearch user to 65,536. This is already set by default in the, 
vim /usr/lib/systemd/system/elasticsearch.service
# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65535

# You also should set the maximum number of processes.
# Specifies the maximum number of processes
LimitNPROC=4096

```

Virtual Memory Settings on master and data node
``` bash
# To ensure that you do not run out of virtual memory, edit the /etc/sysctl.conf and update the value of vm.max_map_count as shown below
vm.max_map_count=262144

# You can simply run the command below to configure virtual memory settings.
echo "vm.max_map_count=262144" >> /etc/sysctl.conf

# To apply the changes
sysctl -p

```

To that far, below is the configuration file on each node
``` bash
# checking elastic yml config 
sudo su
cd /etc/elasticsearch
grep -Ev '^#|^$' /etc/elasticsearch/elasticsearch.yml

```

Elasticsearch service start,enable and restart master-node.
``` bash
# enable
sudo systemctl enable elasticsearch

# start
sudo systemctl start elasticsearch

# status
sudo systemctl status elasticsearch

# restart
sudo systemctl restart elasticsearch

```

Creating a **permanent user** and elastic control
``` bash
# root
sudo su

# go to Related directory
cd /usr/share/elasticsearch

# helping command
./bin/elasticsearch-reset-password --help

# reset password
./bin/elasticsearch-reset-password -u elastic --interactive

# check
curl -k -u elastic https://node-name:port-number or curl -k -u elastic https://ip_addresses:port-number
curl -k -u elastic https://elk-master-1:9200
or
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200

```


Enroll other nodes into elasticsearch cluster on master-node.
``` bash
# Generate Elasticsearch Cluster Enrollment Token
# root and go to location
sudo su
cd /usr/share/elasticsearch

# generate token command the below
./bin/elasticsearch-create-enrollment-token -s node
    eyJ2ZXIiOiI4LjkuMCIsImFkciI6WyIxOTIuMTY4LjEuNDA6OTIwMCJdLCJmZ3IiOiI3ZmI0NzI1NWUxYzI2NzgyZjVlZmVlYTU3M2FkNDgwM2Y3NjNkM2VlOGNhNWNjYjkzMWVjNjQwYzI2MDY5ZjUzIiwia2V5IjoiUFpmdm1Zc0IzOXpiY2w2VU1CUGU6NTM1SFYtMVBSb3V6RHlkMVZrZjNmZyJ9

# slave or other node must be go
sudo su
cd /usr/share/elasticsearch
./bin/elasticsearch-reconfigure-node --enrollment-token token

# Slavemachine: for example
./bin/elasticsearch-reconfigure-node --enrollment-token eyJ2ZXIiOiI4LjkuMCIsImFkciI6WyIxOTIuMTY4LjEuNDA6OTIwMCJdLCJmZ3IiOiI3ZmI0NzI1NWUxYzI2NzgyZjVlZmVlYTU3M2FkNDgwM2Y3NjNkM2VlOGNhNWNjYjkzMWVjNjQwYzI2MDY5ZjUzIiwia2V5IjoiUFpmdm1Zc0IzOXpiY2w2VU1CUGU6NTM1SFYtMVBSb3V6RHlkMVZrZjNmZyJ9

# slave machine enable service 
systemctl enable --now elasticsearch

# edit elasticseacrh.yml. 
# go to elastic directory
cd /etc/elasticsearch
vim elasticsearch.yml
    cluster.name: elk-prod
    node.name: elk-node-1
    node.roles: [ data ]
    path.data: /var/lib/elasticsearch
    path.logs: /var/log/elasticsearch
    #bootstrap.memory_lock: true
    network.host: 192.168.1.41
    http.port: 9200
    discovery.seed_hosts: ["elk-master-1", "elk-node-1"]
    cluster.initial_master_nodes: ["elk-master-1"]
    xpack.security.enabled: true
    xpack.security.enrollment.enabled: true
    xpack.security.http.ssl:
      enabled: true
      keystore.path: certs/http.p12
    xpack.security.transport.ssl:
      enabled: true
      verification_mode: certificate
      keystore.path: certs/transport.p12
      truststore.path: certs/transport.p12

# restarted elastic-slave machine
systemctl restart elasticsearch

# checking servive
systemctl status elasticsearch

# finally master-data check on master-node
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cat/nodes?v
or
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cluster/health/?pretty

```


Elasticsearch password generation for full elastic-component on **master-node**.
``` bash
# root
sudo su

# go to location
cd /usr/share/elasticsearch
or
cd /usr/share/elasticsearch/bin

# password generation elastic
./bin/elasticsearch-reset-password -u elastic -i

# password generation kibana-system
./bin/elasticsearch-reset-password -u kibana-system -i

# boostrap key for users
./bin/elasticsearch-keystore add "bootstrap.password"

# password generation all built-in users
./bin/elasticsearch-setup-passwords interactive

# checking
curl -k -u elastic_username:elastic_password "https://master_ip:elastic_port/_cluster/health?pretty"

curl -k -u elastic:q1w2e3r4* https://localhost:9200
or
curl -k -u elastic:q1w2e3r4* https://master_ip:elastic_port/_cluster/health/?pretty
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cluster/health/?pretty

```

Created self-sign certificate for elk ( ssl/tls)
``` bash
# root
sudo su

# go to certification file
cd /usr/share/elasticsearch

# helping
./bin/elasticsearch-certutil --help

# first,ca generate a new local certificate authority
./bin/elasticsearch-certutil ca 

# second, cert - generate X.509 certificates and keys
./bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12 

# list
ll

# copy certificate
cp elastic-* /etc/elasticsearch/certs/

# go to cert file
cd /etc/elasticsearch/certs

# chown cert directory 
chown -R root:elasticsearch elastic-*
chmod 0660 elastic-*

# restart elasticsearch service
systemctl restart elasticsearch.service

# third, http generate a new local certificate authority
./bin/elasticsearch-certutil http 



```


Keystore create on **master node**
``` bash
# root
sudo su

# go to related directory
cd /usr/share/elasticsearch

# create keystore http
./bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
# ./bin/elasticsearch-keystore add xpack.security.http.ssl.truststore.secure_password


# create keystore transport
./bin/elasticsearch-keystore add xpack.security.transport.ssl.keystore.secure_password
./bin/elasticsearch-keystore add xpack.security.transport.ssl.truststore.secure_password

# show keystore and truststore
./bin/elasticsearch-keystore show xpack.security.http.ssl.keystore.secure_password
# ./bin/elasticsearch-keystore show xpack.security.http.ssl.truststore.secure_password
./bin/elasticsearch-keystore show xpack.security.transport.ssl.keystore.secure_password
./bin/elasticsearch-keystore show xpack.security.transport.ssl.truststore.secure_password

# configure elastic.yml
vim elasticsearch.yml

# restart elasticsearch service
systemctl restart elasticsearch.service

# checking elasticsearch service
systemctl status elasticsearch.service

```



Configuration slave ( data ) node. elasticsearch.yml on elk master node. Cluster name, node,name etc
``` bash
# Note: Certificate must copy from master to slave mavchine
scp elastic-* user_name@ip_address:location
scp elastic-* worker1@192.168.1.41:/home/worker1

# Move cert and chown for slave ( data ) node
mv elastic-* /etc/elasticsearch/certs

# go to directory
cd /etc/elasticsearch/certs

# owner
chown -R root:elasticsearch elastic-*
chown -R elasticsearch:elasticsearch elastic-*
chmod 0660 elastic-*

# go to elastic file
cd /etc/elasticsearch

# edit yaml
vim elasticsearch.yaml

# restart elasticsearch service
systemctl restart elasticsearch.service

# checking elasticsearch service
systemctl status elasticsearch.service

# root
sudo su

# go to related directory
cd /usr/share/elasticsearch

# solved
./bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
./bin/elasticsearch-keystore add xpack.security.http.ssl.truststore.secure_password
./bin/elasticsearch-keystore add xpack.security.transport.ssl.keystore.secure_password
./bin/elasticsearch-keystore add xpack.security.transport.ssl.truststore.secure_password

# show keystore and truststore
./bin/elasticsearch-keystore show xpack.security.http.ssl.keystore.secure_password
./bin/elasticsearch-keystore show xpack.security.http.ssl.truststore.secure_password
./bin/elasticsearch-keystore show xpack.security.transport.ssl.keystore.secure_password
./bin/elasticsearch-keystore show xpack.security.transport.ssl.truststore.secure_password

```


Useful command
``` bash
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cat/shards?v
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cat/master?v
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cluster/state?pretty
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cat/nodes?v&h=id,ip,port,v,m
curl -k -u elastic:q1w2e3r4* https://192.168.1.40:9200/_cluster/state/master_node?pretty

```

# Referance
```
ILM: https://opster.com/guides/elasticsearch/data-architecture/index-lifecycle-policy-management/
Build-In USers: https://www.elastic.co/guide/en/elasticsearch/reference/current/built-in-users.html
Issue_1: https://dev.to/lisahjung/comment/22be3
https://discuss.elastic.co/t/cannot-read-configured-pkcs12-keystore-as-a-truststore/315849
Issue_3_Keystore: https://discuss.elastic.co/t/problem-with-keystore-password-was-incorrect/168950
Update_cluster_certs: https://opster.com/guides/elasticsearch/how-tos/update-elasticsearch-security-certificates/
Disable swap for best performance: https://www.elastic.co/guide/en/elasticsearch/reference/master/setup-configuration-memory.html


```