# Opensight

A comprehensive platform for real-time data analysis and visualization with self-hosting capabilities. Opensight combines a modern Next.js frontend with a powerful Express backend to deliver intelligent data insights.

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- Real-time data analysis and processing
- Interactive dashboard and visualization interface
- RESTful API with comprehensive documentation
- PostgreSQL database with optimized queries
- Redis caching for high-performance operations
- Docker containerization for easy deployment
- TypeScript throughout for type safety
- Monorepo architecture with Turbo for efficient builds
- Development and production configurations

## Quick Start

### Prerequisites

- Node.js 20+ (for local development)
- npm/yarn package manager
- PostgreSQL 16+ (for database)
- Redis 7+ (for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/opensight.git
cd opensight
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development services (PostgreSQL + Redis):
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

5. Run the development servers:
```bash
npm run dev
```

This will start:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000

## Self-Hosting with Docker

### Full Stack Deployment

Deploy the entire application stack (web, API, PostgreSQL, and Redis) using Docker Compose:

```bash
# Build and start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

Services will be available at:
- Web UI: http://localhost:3000
- API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Environment Configuration

Update the `.env` file before deployment with your specific settings:

```env
# Database
DATABASE_URL=postgresql://opensight:opensight@postgres:5432/opensight

# Redis
REDIS_URL=redis://redis:6379

# API Configuration
API_PORT=4000
API_HOST=0.0.0.0

# Web Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Development Stack Only

To run only PostgreSQL and Redis for local development:

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Express, Node.js, TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Containerization**: Docker, Docker Compose
- **Build Tool**: Turbo
- **Package Manager**: npm

## Project Structure

```
opensight/
├── apps/
│   ├── api/              # Express backend application
│   └── web/              # Next.js frontend application
├── packages/
│   ├── db/               # Database utilities and migrations
│   ├── shared/           # Shared types and utilities
│   ├── analyzer/         # Data analysis engine
│   └── engine-clients/   # Engine client libraries
├── docker/
│   ├── Dockerfile.web    # Next.js production build
│   ├── Dockerfile.api    # Express production build
│   ├── docker-compose.yml        # Full stack configuration
│   └── docker-compose.dev.yml    # Development stack
└── README.md             # This file
```

## API Documentation

The API server provides comprehensive REST endpoints documented at:

- **Swagger UI**: http://localhost:4000/api/docs
- **OpenAPI Spec**: http://localhost:4000/api/spec

## Development

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build all applications
npm run build

# Build specific application
npm run build -- --filter=api
npm run build -- --filter=web
```

### Code Formatting

```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and code is properly formatted before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, issues, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation at `/api/docs`

---

Made with by the Opensight Team
