# Elastic-APM Installation and Configuration Guide


Apm: install
``` bash
# dowland
curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-8.9.0-amd64.deb

# install
sudo dpkg -i apm-server-8.9.0-amd64.deb

```


Elastic-APM configuration for apm-server.yml
``` bash
# root
sudo su

# go to directory
cd /etc/apm-server

# edit config
vim apm-server.yml
    apm-server:
        host: "192.168.1.40:8200"
    output.elasticsearch:
        hosts: ["192.168.1.40:9200"]
        protocol: "https"
        username: "elastic"
        password: "q1w2e3r4*"

```

APM service start,enable and restart master node
``` bash
# start
sudo systemctl start apm-server.service

# enable
sudo systemctl enable apm-server.service

# restart
sudo systemctl restart apm-server.service

# status
sudo systemctl status apm-server.service


```


# Refereance
``` bash
Install: https://www.elastic.co/guide/en/apm/guide/current/installing.html


```