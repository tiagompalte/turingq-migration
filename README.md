# TuringQ - Migration

## Commands

### Root Package

- Setting up dependencies for all packages

```
npm run setup
```

### Lerna

- Creating new packages

```
lerna create <package>
```

- Adding dependencies or packages to a specific package

```
lerna add <dependency/package> --scope <package>
```

- Listing all packages

```
lerna list
```

### Run - Frontend
```
cd packages/frontend
npm run start
```

### Run - Core
```
cd packages/core
docker-compose --env-file .env.docker up -d
npm run dev
```

## Run - PGAdmin4

```
docker run -p 9200:80 -e "PGADMIN_DEFAULT_EMAIL=some@email.com" -e "PGADMIN_DEFAULT_PASSWORD=postgres" --add-host=host.docker.internal:host-gateway -d  dpage/pgadmin4
```

## UP Kind
1. Delele old cluster
```
kind delete clusters turingq-local
```

2. Create Registry
```
cd resources/registry
docker-compose up -d
```

3. Recreate the cluster Kind and configure Ingress
```
cd ../kubernetes

sh create-kind-cluster.sh

kubectl apply -f ../ingress/k8s/setup.yml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
  
kubectl apply -f ../ingress/k8s/ingress.yml
```

4. Up authorizer:
- If no have container registry in Docker before, execute:
  ```
  npm run deploy:local:authorizer
  ```
- Or, execute:
  ```
  npm run kubernetes:setup:authorizer
  ```

5. Get KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY env in Keycloak
- Access http://localhost:9090/auth/
- Copy Realm Settings -> Keys -> RS256 - SIG
- Set KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY in files:
  - packages/core/k8s/core/config-map.yml
  - packages/questions/k8s/questions/config-map.yml

6. Up RabbitMq
```
npm run kubernetes:setup:message-broker
```

7. Deploy apps
- If no have container registry in Docker before, execute:
  ```
  npm run deploy:local:core
  npm run deploy:local:frontend
  npm run deploy:local:questions
  ```
- Or, execute:
  ```
  npm run kubernetes:setup:core
  npm run kubernetes:setup:frontend
  npm run kubernetes:setup:questions
  ```

# UP AWS - EKS
1. Config .env
```
cp .env.example .env
```
Edit values: AWS_ACCOUNT_ID and AWS_REGION

2. Login in AWS - ECR
```
npm run docker:prod:login
```

3. In AWS platform, create registries in ECR: authorizer-config, turingq-core, turingq-frontend, turingq-questions and turingq-subscriptions

4. Send images to ECR
```
npm run docker:prepare-prod-image:authorizer-config
npm run docker:prepare-prod-image:core
npm run docker:prepare-prod-image:frontend
npm run docker:prepare-prod-image:questions
npm run docker:prepare-prod-image:subscriptions
```

5. Create cluster EKS
``` 
eksctl create cluster --config-file resources/aws/cluster.yml
```

* Obs.: To destroy the cluster
```
eksctl delete cluster --config-file resources/aws/cluster.yml
```

6. Config ${REPO_HOST}
```
export REPO_HOST=${AWS_ACCOUNT_ID}.dkr.ecr.us-east1.amazonaws.com
```
Obs.: Change value ${AWS_ACCOUNT_ID} to your aws account id

7. Create ingress
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/aws/deploy.yaml
```
Obs.: Verify ingress
```
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

8. Create ingress for the services
```
kubectl apply -f resources/ingress/k8s/ingress.yml
kubectl get svc --namespace=ingress-nginx
```

9. Change values of secrets keys

10. Configure "rootUrl", "redirectUris" and "webOrigins" of packages/authorizer/config/turingq-prod.json to Load Balancer URL (kubectl get svc --namespace=ingress-nginx)

11. Run
```
npm run docker:prepare-prod-image:authorizer-config
```

12. Deploy Authorizer
```
npm run kubernetes:setup:authorizer
```

13. Get KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY env in Keycloak
- Access Keycloak ${REPO_HOST}/auth
- Copy Realm Settings -> Keys -> RS256 - SIG
- Set KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY in files:
  - packages/core/k8s/core/config-map.yml
  - packages/questions/k8s/questions/config-map.yml

14. In packages/frontend change .env.production.local:
- REACT_APP_API_BASE_URL: '${REPO_HOST}/api'
- REACT_APP_AUTH_SERVER_URL: '${REPO_HOST}/auth/'

15. Build the image frontend and send to ECR:
```
npm run docker:prepare-prod-image:frontend
```

16. Config envs of config-maps

17. Deploy the services:
```
npm run kubernetes:setup:message-broker
npm run kubernetes:setup:frontend
npm run kubernetes:setup:core
npm run kubernetes:setup:questions
npm run kubernetes:setup:subscriptions
```
