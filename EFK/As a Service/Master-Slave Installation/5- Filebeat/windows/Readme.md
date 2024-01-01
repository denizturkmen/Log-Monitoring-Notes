# How to install filebeat on Windows

Ssh install on windows
``` bash
# dowland
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# Install the OpenSSH Client
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Install the OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# Start the sshd service
Start-Service sshd

# OPTIONAL but recommended:
Set-Service -Name sshd -StartupType 'Automatic'

# Confirm the Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
    Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
    Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}

```

user and groups create on windows
``` bash
# groups
Remote Desktop Users
Administrators


```

File transfor for scp
``` bash
# transfer
scp filebeat.yml murat@192.168.1.21:C:


```


Filebeat install as a service 
``` bash
# dowland
https://www.elastic.co/downloads/past-releases#filebeat

# Adding policy for powershell
Set-ExecutionPolicy RemoteSigned
Set-ExecutionPolicy unrestricted

# install
./install-service-filebeat.ps1

# ssl configuration
    



```














curl --cacert /etc/elasticsearch/certs/http_ca.crt -u elastic https://192.168.1.40:9200 



# Referance
``` bash
Dowland: https://dosya.co/wg2db137u2wt/log.txt.html
ssh install: https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=powershell

```