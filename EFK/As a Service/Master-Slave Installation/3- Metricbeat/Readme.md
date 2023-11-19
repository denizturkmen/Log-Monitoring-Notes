# Metricbeat Installation and Configuration Guide


Elasticsearch password generation for full elastic-component on **master-node**.
``` bash
# root
sudo su

# go to location
cd /usr/share/elasticsearch
or
cd /usr/share/elasticsearch/bin

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

Install to metricbeat
``` bash
# dowland
curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-8.9.0-amd64.deb

# install
sudo dpkg -i metricbeat-8.9.0-amd64.deb

```


Enable xpack settings permanently
``` bash
# show cluster setting
GET _cluster/settings

# enable x-pack setting

PUT _cluster/settings
{
  "persistent": {
    "xpack.monitoring.collection.enabled": true
  }
}

```


Metricbeat configuration
``` bash
# root
sudo su

# go to related directory
cd /etc/metricbeat

# open config file
vim metricbeat.yml
  setup.kibana:
    host: "192.168.1.40:5601"
  
  output.elasticsearch:
    hosts: ["elk-master-1:9200"]
    protocol: "https"
    username: "elastic"
    password: "q1w2e3r4*"

```

Module enable system, elasticsearch and kibana
``` bash
# root
sudo su

# module list before go to directory
cd /etc/metricbeat/modules.d
metricbeat modules list

# enable system
metricbeat modules enable system

# configuration system
- module: system
  period: 10s
  metricsets:
    - cpu
    - load
    - memory
    - network
    - process
    - process_summary
    - socket_summary
    #- entropy
    #- core
    #- diskio
    #- socket
    #- service
    #- users
  process.include_top_n:
    by_cpu: 5      # include top 5 processes by CPU
    by_memory: 5   # include top 5 processes by memory
# Configure the mount point of the host’s filesystem for use in monitoring a host from within a container
# hostfs: "/hostfs"

- module: system
  period: 1m
  metricsets:
    - filesystem
    - fsstat
  processors:
  - drop_event.when.regexp:
      system.filesystem.mount_point: '^/(sys|cgroup|proc|dev|etc|host|lib|snap)($|/)'

- module: system
  period: 15m
  metricsets:
    - uptime

#- module: system
#  period: 5m
#  metricsets:
#    - raid


```

Module enable elasticsearch and elasticsearch-xpack
``` bash
# root
sudo su

# module list before go to directory
cd /etc/metricbeat/modules.d
metricbeat modules list

# enable elasticsearch
metricbeat modules enable elasticsearch
metricbeat modules enable elasticsearch-xpack

# configuration elasticsearch.yml
    
- module: elasticsearch
  metricsets:
    - node
    - node_stats
  period: 10s
  hosts: ["http://192.168.1.40:9200"]
  username: "elastic"
  password: "q1w2e3r4*"

# configuration elasticsearch-xpack.yml
- module: elasticsearch
  xpack.enabled: true
  period: 10s
  hosts: ["https://192.168.1.40:9200"]
  username: "elastic"
  password: "q1w2e3r4*"

```


Module enable kibana
``` bash
# root
sudo su

# module list before go to directory
cd /etc/metricbeat/modules.d
metricbeat modules list

# enable system
metricbeat modules enable kibana

# configuration kibana.yml
- module: kibana
  metricsets:
    - status
  period: 10s
  hosts: ["192.168.140:5601"]
  #basepath: ""
  username: "elastic"
  password: "q1w2e3r4*"

```

Permission: node role 
``` bash
# root
sudo su

# go to directory
cd /etc/elasticsearch

# configuration: adding remote_cluster_client 
vim elasticsearch.yml
    node.roles: [ master, data, remote_cluster_client ]

# restart elasticsearch service
systemctl restart elasticsearch

# status elasticsearch service
systemctl status elasticsearch

# checking kibana ui

```


Metricbeat service start,enable and restart master node
``` bash
# enable
sudo systemctl enable metricbeat.service

# start
sudo systemctl start metricbeat.service

# status
sudo systemctl status metricbeat.service

# restart
sudo systemctl restart metricbeat.service



```


# referance
```
install: https://www.elastic.co/guide/en/beats/metricbeat/8.9/metricbeat-installation-configuration.html
apt-package install: https://www.elastic.co/guide/en/beats/metricbeat/8.9/setup-repositories.html



```