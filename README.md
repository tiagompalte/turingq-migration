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

## K8S

### Resources
```
sh resources/kubernetes/create-kind-cluster.sh

kubectl apply -f resources/ingress/k8s/setup.yml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

kubectl apply -f resources/ingress/k8s/ingress.yml
```
### Packages
```
npm run deploy:local:authorizer
npm run deploy:local:core
npm run deploy:local:frontend
```

### Set env KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY
- Acesse o Keycloak dashboard
- Vá em: Realm Settings -> Keys -> RS256 - SIG
- Copie o valor de Public Key
- Cole em packages/core/k8s/core/config-map.yml
