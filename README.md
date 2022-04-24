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

## Using Kind
1. Delete cluster kind
```
kind delete clusters turingq-local
```

2. Create Registry
```
cd resources/registry
docker-compose up -d
```

3. Resources
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

4. Deploy Keycloak
```
npm run deploy:local:authorizer
```

5. Get KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY env in Keycloak
- Access http://localhost:9090/auth/
- Copy Realm Settings -> Keys -> RS256 - SIG
- Set KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY in files:
  - packages/core/k8s/core/config-map.yml
  - packages/questions/k8s/questions/config-map.yml

6. Deploy apps
```
npm run deploy:local:core
npm run deploy:local:frontend
npm run deploy:local:questions
```
