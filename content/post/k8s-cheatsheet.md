---
title: "My Kubernetes cheat sheet"
date: "2020-04-28T20:01:00Z"
tags: ["k8s", "helm"]
categories: ["Development"]
---

Kubernetes is a container-orchestration system we use at my current job.
It's not my primary focus at work but from time to time I need to use
the `kubectl` command line tool. The is a small cheat sheet to refresh
my memory.<!--more-->

## Kubernetes

```sh
####
# VERIFY CONFIGURATION
####
kubectl cluster-info # Display cluster info
kubectl config view # Display merged kubeconfig settings

####
# LISTING, FINDING RESOURCES
####
kubectl api-resources # List supported resources
kubectl get nodes -n <namespace> # Review status and roles of nodes
kubectl get nodes -n <namespace> -o wide  # Show additional information about nodes in cluster
kubectl get services -n <namespace> # Show services
kubectl get pods -n <namespace> # List pods
kubectl get pods -n <namespace> --show-labels # Show labels for pods
kubectl get pods -n kube-system # List system pods
kubectl get all --all-namespaces | more # List all resources in all namespaces

####
# EXAMINING RESOURCES
####
kubectl describe <resource> # Check out Name, Taints, Conditions, Addresses, System Info, Non-Terminated Pods, and Events

####
# CONNECTION TO RESOURCES
####
kubectl exec <pod> -n <namespace> ls # List directory
kubectl exec -it <pod> -n <namespace> sh # Run interactive shell

####
# PORT FORWARDING
####
kubectl port-forward service/<service> 8080:80 -n <namespace>
kubectl port-forward <pod> 8080:80 -n <namespace>

####
# LOGS
####
kubectl logs <pod> -n <namespace> # dump pod logs (stdout)
kubectl logs -l name=myLabel -n <namespace> # dump pod logs with label (stdout)
kubectl logs -f <pod> -n <namespace> # stream pod logs (stdout)
```

## Helm (v2)

```sh
helm list --all-namespaces # List releases with some basic information

helm delete <release-name> # Delete release from k8s cluster; deletes all k8s objects belonging to release
helm delete <release-name> --purge # Delete release with all the config data (configmap)
helm reset # Deleted Tiller's pod, service and deployment; deletes only service side


helm install <chart> # Install a Chart
helm install <chart> --dry-run --debug #
helm upgrade <release> <chart> # Upgrade a release to a new revision
helm rollback <release> <version> # Rollback a release to a previous revision

helm history <release> # Lists revision history of the release
helm status <release> # Display status of the release (installed objects and running statuses)
helm get <release> # Show details about the release, chart and current values

```

# Resources

- https://kubernetes.io/docs/reference/kubectl/cheatsheet/
