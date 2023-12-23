# Prometheus-Stack install and configure on Kubernetes

Install helm with the following command
``` bash
# install helm with package
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null

sudo apt-get install apt-transport-https --yes

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list

sudo apt-get update

sudo apt-get install helm


# checking helm install
helm 
or
helm version

```


Prometheus-stack install on kubernetes
``` bash
# create ns
kubectl create ns monitoring

# check ns
kubectl get ns

# adding helm repository for promethues-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# updating helm repo
helm repo update

# repo search
helm search repo prometheus

# shoe values.yaml
helm show values prometheus-community/kube-prometheus-stack

# install kube-prometheus-stack
helm install [RELEASE_NAME] prometheus-community/kube-prometheus-stack
helm install promethues-stack prometheus-community/kube-prometheus-stack -n monitoring

# check all object
kubectl get all -n monitoring 

# expose to grafana service
kubectl edit svc -n monitoring promethues-stack-grafana 
or
kubectl patch svc -n monitoring promethues-stack-grafana -p '{"spec": {"type": "LoadBalancer"}}'

# learn grafana-ui password
kubectl get secret -n monitoring

# describe
kubectl describe secrets -n monitoring promethues-stack-grafana 

# format
kubectl get secrets -n monitoring promethues-stack-grafana -o yaml
kubectl get secrets -n monitoring promethues-stack-grafana -o json

# decoded
echo -n "cHJvbS1vcGVyYXRvcg==" | base64 --decode ; echo

# grafana-ui username and passwod
admin
prom-operator


```



Usefull helm command
``` bash
helm repo ls
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo prometheus-community/kube-prometheus-stack
helm search repo prometheus-community/kube-prometheus-stack
helm show values prometheus-community/kube-prometheus-stack
helm search repo prometheus-community/kube-prometheus-stack --versions
helm show chart prometheus-community/kube-prometheus-stack --version 23.0.7
helm show readme prometheus-community/kube-prometheus-stack --version 23.0.7
helm show values prometheus-community/kube-prometheus-stack --version 23.0.7
helm show all prometheus-community/kube-prometheus-stack --version 23.0.7
helm -n kafka upgrade --install prometheus prometheus-community/kube-prometheus-stack--create-namespace --set persistence.size=8Gi,logPersistence.size=8Gi,volumePermissions.enabled=true,persistence.enabled=true,logPersistence.enabled=true,serviceAccount.create=true,rbac.create=true --version 23.0.7 -f prometheus-community/kube-prometheus-stack.yaml



```





# Referance
``` bash
Helm: https://helm.sh/docs/intro/install/
Prometheus-Stack: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack


```