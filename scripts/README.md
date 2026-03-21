# Database Scripts

## ping-database.js

A health check script that pings the MongoDB database to verify connectivity and keep the connection alive.

### Usage

```bash
# With environment variable
MONGODB_URI="mongodb://..." node scripts/ping-database.js

# Or set in .env
node scripts/ping-database.js
```

### Features

- Automatic retry logic (3 attempts)
- Connection timeout handling
- Database statistics reporting
- Collection enumeration
- Ping latency measurement

### CI/CD Integration

This script is automatically run by GitHub Actions workflows:

- **database-health-check.yml**: Comprehensive health check every 10 minutes
- **database-keep-alive.yml**: Lightweight ping every 5-30 minutes to keep database active

### Environment Variables

- `MONGODB_URI`: MongoDB connection string (required)
- `MONGO_CLUSTER`: Fallback connection string

### Exit Codes

- `0`: Success
- `1`: Failed after all retries
