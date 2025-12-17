# Docker Development Environment

This directory contains the Docker Compose configuration for the development environment.

### Files

- **`docker-compose.yml`** - Docker Compose configuration for all development services
- **`mongo/Dockerfile`** - Custom MongoDB Docker image with replica set configuration
- **`zitadel/pat-admin.pat`** - Zitadel admin personal access token output file
- **`zitadel/pat-login-client.pat`** - Zitadel login client personal access token output file

### Services

The development environment includes:

1. **MongoDB** - Database with replica set configuration
2. **MinIO** - S3-compatible object storage
3. **Zitadel** - Identity and access management
4. **Zitadel Database** - PostgreSQL database for Zitadel
5. **Zitadel Login** - Login UI for Zitadel

## Environment Variables

Some configuration and secrets need to be shared between the Nuxt application and Docker environment.
That's why the .env file in the root folder of this project holds This information in a central place.

## Usage

### Starting the Development Environment

```bash
# From the project root
docker-compose --env-file .env -f dev_docker/docker-compose.yml up -d

# From the dev_docker directory
docker-compose --env-file ../.env up -d
```

### Stopping the Development Environment

```bash
# From the dev_docker directory
docker-compose down

# To also remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Viewing Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mongodb
docker-compose logs -f zitadel
docker-compose logs -f minio
```

## Ports

The following ports are exposed:

- **27017** - MongoDB
- **5432** - PostgreSQL (Zitadel database)
- **8080** - Zitadel API
- **3000** - Zitadel Login UI
- **9000** - MinIO API
- **9001** - MinIO Console

## Data Persistence

Data is persisted using Docker volumes:

- `mongo-data` - MongoDB data
- `mongo-config` - MongoDB configuration
- `data_zitadel` - PostgreSQL data
- `minio-data` - MinIO data

## Troubleshooting

### MongoDB Replica Set

MongoDB will fail starting on first launch.
You need to initialize the replica set:

```bash
# Connect to MongoDB container
docker exec -it mongodb mongosh

# Use admin database
use admin

# Promote to root (with password from .env)
db.auth("root", "root")

# Initialize replica set
rs.initiate({ _id: "rs0", members:[{ _id: 0, host: "localhost:27017" }]})
```

### Zitadel Setup

Zitadel will automatically initialize on first run. The setup process may take a few minutes. You can monitor the progress with:

```bash
docker-compose logs -f zitadel
```

Log in to zitadel via http://localhost:8080/ui/console?login_hint=zitadel-admin@zitadel.localhost and enter `Password1!` to log in.

### MinIO Access

- **Console**: http://localhost:9001
- **API**: http://localhost:9000
- **Credentials**: see .env file

### Zitadel access

- **Console**: http://localhost:8080/ui/console/
- **Username**: admin@rbag.localhost
- **Password**: Password1!

## Development Workflow

1. Copy `.env.example` to `.env` in the project root
2. Update `.env` with any custom values if needed
3. Start the development environment: `docker-compose up -d`
4. Start your Nuxt application: `pnpm dev`
5. Access the application at http://localhost:3001

## Security Note

The credentials in `.env` are for development only. Do not use these credentials in production environments.
