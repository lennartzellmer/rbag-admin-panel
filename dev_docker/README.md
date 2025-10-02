# Docker Development Environment

This directory contains the Docker Compose configuration for the development environment.

### Files

- **`docker-compose.yml`** - Docker Compose configuration for all development services
- **`Dockerfile`** - Custom MongoDB Docker image with replica set configuration

### Services

The development environment includes:

1. **MongoDB** - Event store database with replica set configuration
2. **Zitadel** - Identity and access management
3. **Zitadel Database** - PostgreSQL database for Zitadel
4. **Zitadel Login** - Login UI for Zitadel
5. **MinIO** - S3-compatible object storage

## Usage

### Starting the Development Environment

```bash
# From the dev_docker directory
docker-compose up -d

# Or from the project root
cd dev_docker && docker-compose up -d
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

## Environment Variables

All environment variables are defined in `docker.env`. This file contains:

- **MongoDB Configuration** - Database credentials and connection settings
- **MinIO Configuration** - Object storage credentials and settings
- **Zitadel Configuration** - Identity management settings
- **PostgreSQL Configuration** - Database settings for Zitadel
- **Session Configuration** - Application session settings

### Synchronization with Application

The application's `.env.example` file references the same values as `docker.env` to ensure consistency. When you update values in `docker.env`, make sure to update the corresponding values in `.env.example` (or your local `.env` file).

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

If MongoDB fails to start, you may need to initialize the replica set:

```bash
# Connect to MongoDB container
docker exec -it mongodb mongosh

# Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" }
  ]
})
```

### Zitadel Setup

Zitadel will automatically initialize on first run. The setup process may take a few minutes. You can monitor the progress with:

```bash
docker-compose logs -f zitadel
```

### MinIO Access

- **Console**: http://localhost:9001
- **API**: http://localhost:9000
- **Credentials**: minioadmin / minioadmin123

## Development Workflow

1. Start the development environment: `docker-compose up -d`
2. Copy `.env.example` to `.env` in the project root
3. Update `.env` with any custom values if needed
4. Start your Nuxt application: `pnpm dev`
5. Access the application at http://localhost:3000

## Security Note

The credentials in `docker.env` are for development only. Do not use these credentials in production environments.
