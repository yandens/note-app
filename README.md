# Project Setup & Run Guide

## 1. Build and Start Docker Container

```sh
docker run --name wwwaste-mongo -d -p 27017:27017 mongo:7 --replSet rs0
docker exec -it wwwaste-mongo mongosh --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})"
```

## 2. Copy Environment File

Copy the example environment file and update values as needed:

```sh
cp .env.example .env
```

## 3. Install Dependencies

Make sure you have [pnpm](https://pnpm.io/) installed or another package manager, then run:

```sh
pnpm install
```

## 4. Run the Development Server

Start the server in development mode:

```sh
pnpm dev
```

## Notes

- Ensure Docker is installed and running on your system.
- Update `.env` with your configuration before starting the server.
- The api documentation is on `/documentation` path

