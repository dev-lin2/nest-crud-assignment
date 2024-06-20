## About project
- This project is aiming to provide basic CRUD operations using NestJs and Prisma

  
## Setup

- Copy codes from `.env.example` to `.env` (Create new file if not exist yet)
- (Optional) Update username and password if you want to change database url. Also need to update `docker-compose.yml` with new credentials

## Installation

- run `docker compose up` for database container
- run `npm/yarn install`
- run `npm/yarn prisma migrate`
- run `npm/yarn test`