# Kibana Installation and Configuration Guide

Kibana install on elk master node
``` bash
# dowland gpg-key 
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

# save the repository definition to /etc/apt/sources.list.d/elastic-8.x.list
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# install latest version
sudo apt update
sudo apt install -y kibana

# install a specific version
sudo apt install apt-transport-https
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.9.0-amd64.deb
sudo dpkg -i kibana-8.9.0-amd64.deb

```

Kibana service start,enable and restart master node
``` bash
# enable
sudo systemctl enable kibana

# start
sudo systemctl start kibana

# status
sudo systemctl status kibana

# restart
sudo systemctl restart kibana

```

Kibana config 
``` bash
# open config file
vim /etc/kibana/kibana.yml




 /var/log/kibana/kibana.log
```



# Referance
``` bash
Dowland: https://www.elastic.co/downloads/past-releases#kibana
Issue_1: https://stackoverflow.com/questions/74360864/kibana-error-unable-to-retrieve-version-information-from-elasticsearch-nodes-s



```

