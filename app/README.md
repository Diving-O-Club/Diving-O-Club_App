# Diving O Club – Development Environment

This repository contains the development environment for the *Diving O Club* application.
The goal is to provide a reproducible and containerized setup for local development.

## Requirements
- Docker
- Docker Compose

## Getting started

```bash
cd app
cp .env.example .env
docker compose up
```

## Services
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Database: PostgreSQL (Docker container)

## Environment variables
All required environment variables are documented in the .env.example file.
The .env file is used locally and is intentionally ignored by Git.