#!/bin/bash

# Get the current namespace from the kube context (default if not set)
NAMESPACE=$(kubectl config view --minify --output 'jsonpath={..namespace}')
NAMESPACE=${NAMESPACE:-default}

echo "Cleaning up non-running pods in namespace: $NAMESPACE"

# List pods that are not in Running state and delete them
kubectl get pods --namespace "$NAMESPACE" --field-selector=status.phase!=Running -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | while read pod; do
  echo "Deleting pod: $pod"
  kubectl delete pod "$pod" --namespace "$NAMESPACE"
done