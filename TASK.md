# BMSE - Projeto Módulo 4
### Aluno: Tiago Mariani Palte
### Repositorio: https://github.com/tiagompalte/turingq-migration

## Etapa 1: atividades preliminares
### 1. Banco de dados para o Keycloak local
- packages/authorizer/docker-compose.yml
```
version: '3'

services:
  authorizer:
    image: quay.io/keycloak/keycloak:15.0.2
    container_name: turingq-authorizer-dev
    restart: always
    environment:
      KEYCLOAK_USER: ${KEYCLOAK_USER}
      KEYCLOAK_PASSWORD: ${KEYCLOAK_PASSWORD}
      DB_VENDOR: ${KEYCLOAK_DB_VENDOR}
      DB_ADDR: ${PG_HOST}
      DB_DATABASE: ${PG_DB_NAME}
      DB_USER: ${PG_USER}
      DB_SCHEMA: ${PG_SCHEMA}
      DB_PASSWORD: ${PG_PASSWORD}
    ports:
      - ${KEYCLOAK_PORT}:8080
    networks:
      - turingq-keycloak-net
      - turingq-keycloak-database-net
    depends_on:
      - postgres

  authorizer-config:
    image: quay.io/adorsys/keycloak-config-cli:latest-15.0.2
    container_name: turingq-authorizer-config-dev
    networks:
      - turingq-keycloak-net
    restart: always
    environment:
      KEYCLOAK_URL: http://turingq-authorizer-dev:8080/auth
      KEYCLOAK_USER: ${KEYCLOAK_USER}
      KEYCLOAK_PASSWORD: ${KEYCLOAK_PASSWORD}
      KEYCLOAK_AVAILABILITYCHECK_ENABLED: "true"
      KEYCLOAK_SSLVERIFY: "false"
      IMPORT_PATH: /config
    volumes:
      - ./config/turingq.json:/config/turingq.json
    depends_on:
      - authorizer

  postgres:
    image: postgres:13-alpine
    container_name: turingq-authorizer-database-dev
    restart: always
    environment:
      POSTGRES_PASSWORD: ${PG_PASSWORD}
      POSTGRES_DB: ${PG_DB_NAME}
    volumes:
      - turingq-authorizer-db-data:/var/lib/postgresql/data
    ports:
      - ${PG_PORT}:5432
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - turingq-keycloak-database-net

networks:
  turingq-keycloak-net:
    driver: bridge
  turingq-keycloak-database-net:
    driver: bridge

volumes:
  turingq-authorizer-db-data:
```

- packages/authorizer/.env
```
KEYCLOAK_USER=keycloak-admin
KEYCLOAK_PASSWORD=keycloak-admin
KEYCLOAK_PORT=8080
KEYCLOAK_DB_VENDOR=POSTGRES
PG_HOST=postgres
PG_PORT=6000
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB_NAME=ituring
PG_SCHEMA=public
```

### 2. Uso do "run-p" e "wildcard" no script do package.json
- package.json
```
"scripts": {
  "docker:build:authorizer-config": "DOCKER_BUILDKIT=1 docker build -t turingq/authorizer-config:latest -f packages/authorizer/Dockerfile.prod .",
  "docker:build:core": "docker build -t turingq/core:latest -f packages/core/Dockerfile.prod .",
  "docker:build:frontend": "DOCKER_BUILDKIT=1 docker build -t turingq/frontend:latest -f packages/frontend/Dockerfile.prod .",
  "docker:build:questions": "docker build -t turingq/questions:latest -f packages/questions/Dockerfile.prod .",
  "docker:build:subscriptions": "docker build -t turingq/subscriptions:latest -f packages/subscriptions/Dockerfile.prod .",
  "docker:local:tag:authorizer-config": "docker tag turingq/authorizer-config localhost:5000/turingq-authorizer-config",
  "docker:local:tag:core": "docker tag turingq/core localhost:5000/turingq-core",
  "docker:local:tag:frontend": "docker tag turingq/frontend localhost:5000/turingq-frontend",
  "docker:local:tag:questions": "docker tag turingq/questions localhost:5000/turingq-questions",
  "docker:local:tag:subscriptions": "docker tag turingq/subscriptions localhost:5000/turingq-subscriptions",
  "docker:local:push:authorizer-config": "docker push localhost:5000/turingq-authorizer-config",
  "docker:local:push:core": "docker push localhost:5000/turingq-core",
  "docker:local:push:frontend": "docker push localhost:5000/turingq-frontend",
  "docker:local:push:questions": "docker push localhost:5000/turingq-questions",
  "docker:local:push:subscriptions": "docker push localhost:5000/turingq-subscriptions",
  "docker:prepare-local-image:authorizer-config": "run-s docker:build:authorizer-config docker:local:tag:authorizer-config docker:local:push:authorizer-config",
  "docker:prepare-local-image:core": "run-s docker:build:core docker:local:tag:core docker:local:push:core",
  "docker:prepare-local-image:frontend": "run-s docker:build:frontend docker:local:tag:frontend docker:local:push:frontend",
  "docker:prepare-local-image:questions": "run-s docker:build:questions docker:local:tag:questions docker:local:push:questions",
  "docker:prepare-local-image:subscriptions": "run-s docker:build:subscriptions docker:local:tag:subscriptions docker:local:push:subscriptions",
  "docker:all:prepare-local-image": "run-p docker:prepare-local-image:*",
  "docker:all:build": "run-p docker:build:*",
  "docker:all:local-tag": "run-p docker:local:tag:*",
  "docker:all:local-push": "run-p docker:local:push:*"
  }
```

### 3. Deploy do banco de dados no Kubernetes para o Keycloak
- packages/authorizer/k8s/database/config-map.yml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: authorizer-database-configmap
  namespace: default
data:
  POSTGRES_DB: 'turingq-authorizer'
```

- packages/authorizer/k8s/database/config-map.example.yml
```
#apiVersion: v1
#kind: ConfigMap
#metadata:
#  name: authorizer-database-configmap
#  namespace: default
#data:
#  POSTGRES_DB: 'turingq-authorizer'
```

- packages/authorizer/k8s/database/deployment.yml
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: authorizer-database-deployment
  namespace: default
spec:
  selector:
    matchLabels:
      app: authorizer-database
  replicas: 1
  template:
    metadata:
      labels:
        app: authorizer-database
    spec:
      containers:
        - envFrom:
          - configMapRef:
              name: authorizer-database-configmap
          - secretRef:
              name: authorizer-database-secret
          name: authorizer-database
          image: postgres:13-alpine
```

- packages/authorizer/k8s/database/secret.yml
```
apiVersion: v1
kind: Secret
metadata:
  name: authorizer-database-secret
  namespace: default
type: Opaque
data:
  POSTGRES_PASSWORD: 'cG9zdGdyZXM='
```

- packages/authorizer/k8s/database/secret.example.yml
```
#apiVersion: v1
#kind: Secret
#metadata:
#  name: authorizer-database-secret
#  namespace: default
#type: Opaque
#data:
#  POSTGRES_PASSWORD: ''
```

- packages/authorizer/k8s/database/service.yml
```
kind: Service
apiVersion: v1
metadata:
  name: authorizer-database-service
  namespace: default
spec:
  type: NodePort
  ports:
    - name: http
      port: 5432
      targetPort: 5432
      nodePort: 30005
  selector:
    app: authorizer-database
```

.gitignore
```
node_modules
build
coverage
.nyc_output
tmp
.vscode/*
!.vscode/launch.json
.DS_STORE
.env
.env.docker
**/config-map.yml
**/secret.yml
```

## Nova funcionalidade
```
```
