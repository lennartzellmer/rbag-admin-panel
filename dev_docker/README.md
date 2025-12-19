# Docker Development Environment

This directory contains the Docker configuration for the development environment.
It also contains the Terraform configuration for the IDP provider Zitadel


## Quick start

1. Copy `.env.example` to `.env` in the project root with
   cp .env.example .env
2. From the project root run
   `docker-compose --env-file .env -f dev_docker/docker-compose.yml up -d`
3. Run the terraform config for zitadel 
   `cd dev_docker/terraform && terraform init && terraform apply && terraform output -json`
4. Take the output from the previous terraform step and add it to the .env file
5. From the project root start the Nuxt application
   `pnpm dev`
6. Access the application at http://localhost:3001

### Services

The development environment includes:

1. **MongoDB** - Database with replica set configuration for the nuxt app
2. **MinIO** - S3-compatible object storage
3. **Zitadel** - Identity and access management
4. **Zitadel Database** - PostgreSQL database for Zitadel
5. **Zitadel Login** - Login UI for Zitadel
6. **Mailhog** - Mail catcher for testing email sends

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
- **1025** - Mailhog SMTP port
- **8035** - Mailhog UI

## Data Persistence

Data is persisted using Docker volumes:

- `mongo-data` - MongoDB data
- `mongo-config` - MongoDB configuration
- `data_zitadel` - PostgreSQL data
- `minio-data` - MinIO data

## Troubleshooting

### MongoDB Replica Set

MongoDB initializes a replica set on launch.
If it fails to do so one can create the replica set config like that:

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

Zitadel will initialize on first run. The setup process may take a few minutes. You can monitor the progress with:

```bash
docker-compose logs -f zitadel
```

- **Console**: http://localhost:8080/ui/console/
- **Username**: admin@rbag.localhost
- **Password**: Password1!

### Terraform Provisioning (Zitadel)

The Terraform config lives in `dev_docker/terraform/main.tf` and expects a ZITADEL service account JSON at `dev_docker/zitadel/key-service-user.json`. The key-service-user.json file will be created automatically on zitadels first start.

### Apply the Terraform config
```
cd dev_docker/terraform
terraform init
terraform apply
```

### MinIO Access

- **Console**: http://localhost:9001
- **API**: http://localhost:9000
- **Credentials**: see .env file
