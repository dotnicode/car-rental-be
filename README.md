# Car Rental API

A NestJS-based REST API for managing a car rental service with image handling capabilities.

## Overview

This API provides endpoints to manage cars and their associated pictures in a car rental system. It uses PostgreSQL for data storage and AWS S3 for picture storage.

## Features

- CRUD operations for cars
- Image upload and management
- AWS S3 integration for picture storage
- PostgreSQL database integration
- Environment configuration validation
- Error handling and custom exceptions

## Dependencies

- NestJS
- TypeORM
- Docker
- PostgreSQL
- AWS SDK
- Class Validator
- Class Transformer
- Joi
- Stellar (not implemented)
- Swagger (not implemented)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables `cp .env.example .env`
4. Up docker containers `docker compose up -d`
5. Set up AWS Global Credentials `aws configure`
6. Create a AWS S3 Bucket `aws --endpoint-url=http://localhost:4566 s3 mb s3://car-rental-bucket`
7. Create an User Pool `aws --endpoint http://localhost:9229 cognito-idp create-user-pool --pool-name car-rental-pool`
8. Create an User Pool Client `aws --endpoint-url http://localhost:9229 cognito-idp create-user-pool-client --user-pool-id <userPoolId> --client-name car-rental-client`
9. Start the development server: `npm run start:dev`

## Testing

The project includes comprehensive unit tests for controllers and services. Run tests with:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

## API Documentation

The API documentation is available at `http://localhost:<port>/api/docs`
