# How can I ssl connection with Filebeat on the elasticsearch


Filebeat install as a service
``` bash
# dowland
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.9.0-amd64.deb

# install
sudo dpkg -i filebeat-8.9.0-amd64.deb 

# checking service
systemctl status filebeat.service

```

Filebeat config test 
``` bash
# go to install directory
cd /usr/share/filebeat/bin

# configure to filebeat.yml
    setup.dashboards.enabled: true
    ssl.certificate_authorities: "/etc/elasticsearch/certs/http_ca.crt"
# test config
./filebeat test config -c /etc/filebeat/filebeat.yml --path.home /usr/share/filebeat/ --path.data /var/lib/filebeat

# test config with ouput
./filebeat test output -c /etc/filebeat/filebeat.yml --path.home /usr/share/filebeat/ --path.data /var/lib/filebeat

# setup
./filebeat setup -c /etc/filebeat/filebeat.yml --path.home /usr/share/filebeat/ --path.data /var/lib/filebeat

# start service
systemctl start filebeat

# enable service
systemctl enable filebeat

# status service
systemctl status filebeat

# journalxtl
journalctl -u filebeat.service -n 90
```



# Referance
``` bash
https://www.elastic.co/guide/en/beats/filebeat/8.9/filebeat-installation-configuration.html


```
