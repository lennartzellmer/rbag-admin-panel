# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Docker

```bash
docker-compose -f dev_docker/docker-compose.yml up -d
```
Set up mongo replica set

```bash
docker exec -it mongodb mongosh -u root -p root --authenticationDatabase admin --eval "rs.initiate({
 _id: \"rs0\",
 members: [
   {_id: 0, host: \"localhost:27017\"}
 ]
})"
```

use this connection string to connect to the mongo replica set

```bash
mongodb://root:root@localhost:27017/admin?authSource=admin&replicaSet=rs0&readPreference=primary
```



## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
