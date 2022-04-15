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
