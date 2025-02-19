# Monitoring Events with kubectl and Grafana Loki


## Installing helm3
``` bash
# Update your system packages:
sudo apt-get update

# Install helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash -

# check version
helm version

```


## Installing Krew
``` bash
# Make sure that git is installed. Run this command in your terminal to download and install krew:

begin
  set -x; set temp_dir (mktemp -d); cd "$temp_dir" &&
  set OS (uname | tr '[:upper:]' '[:lower:]') &&
  set ARCH (uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/') &&
  set KREW krew-$OS"_"$ARCH &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/$KREW.tar.gz" &&
  tar zxvf $KREW.tar.gz &&
  ./$KREW install krew &&
  set -e KREW temp_dir &&
  cd -
end

# Add the $HOME/.krew/bin directory to your PATH environment variable. To do this, update your config.fish file and append the following line:
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

# Updating krew plugin
kubectl krew update

# To search for available plugins, run
kubectl krew search

# Installing podevent plugin
kubectl krew install podevents

# To list all installed plugins, run
kubectl krew list

```


## 
``` bash
# Dowland
helm repo add deliveryhero https://charts.deliveryhero.io/

# Updating helm repo
helm repo update

# Install
kubectl create ns monitoring
helm -n monitoring install k8s-event-logger deliveryhero/k8s-event-logger

# Cheching
kubectl get pods  --namespace=monitoring -l "app.kubernetes.io/name=k8s-event-logger,app.kubernetes.io/instance=k8s-event-logger"

# Logging pods events
kubectl logs -n monitoring -l "app.kubernetes.io/name=k8s-event-logger"
```



## Install and Configure Grafana Loki
``` bash
# Add and update the Loki Helm repository
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# list repo
helm repo list

# search repo
helm search repo stack_name

# show values.yaml and dowland
helm show values grafana/loki-stack > loki-stack-values.yaml

# Install Loki
helm install loki grafana/loki-stack -f loki-stack-values.yaml --namespace loki --create-namespace

# Learn password
kubectl get secret loki-grafana -n loki -o jsonpath='{.data.admin-password}' | base64 --decode


```


## Referance
``` bash
# Setup: 
    https://krew.sigs.k8s.io/docs/user-guide/setup/install/
    https://krew.sigs.k8s.io/docs/user-guide/quickstart/
# Plugin list: 
    https://rtfm.co.ua/en/kubernetes-the-krew-plugins-manager-and-useful-kubectl-plugins-list/




```