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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run start:dev`

## Testing

The project includes comprehensive unit tests for controllers and services. Run tests with:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

## Dependencies

- NestJS
- TypeORM
- PostgreSQL
- AWS SDK
- Class Validator
- Joi
