# WSL2/Docker Desktop MySQL Connection Issue

## Problem Overview

Docker Desktop running on Windows with the WSL2 engine creates a separate `docker-desktop` distro that doesn't communicate well with other WSL distributions (like `Ubuntu-22.04`). This causes connectivity issues when trying to connect to MySQL containers from applications running in different WSL distros.

## The Core Issue

- **Docker Desktop**: Runs containers in the `docker-desktop` WSL2 distro
- **Development Environment**: Running in `Ubuntu-22.04` WSL2 distro  
- **Network Isolation**: These distros have separate network stacks, preventing direct communication

## Current Workaround: Native MySQL on Ubuntu WSL

Since the Docker networking issue remains unresolved, we're currently running MySQL natively on the Ubuntu WSL instance rather than in a Docker container.

### Setup Steps

1. **Install MySQL Server on Ubuntu WSL**:
   ```bash
   sudo apt update
   sudo apt install mysql-server
   ```

2. **Configure MySQL**:
   ```bash
   sudo mysql_secure_installation
   ```

3. **Start MySQL Service**:
   ```bash
   sudo service mysql start
   # or use systemctl if available
   sudo systemctl start mysql
   ```

4. **Create Database and User**:
   ```bash
   sudo mysql -u root -p
   ```
   ```sql
   CREATE DATABASE finance_db;
   CREATE USER 'financeuser'@'localhost' IDENTIFIED BY 'financepass123';
   GRANT ALL PRIVILEGES ON finance_db.* TO 'financeuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Update Environment Configuration**:
   ```env
   MYSQL_URL="mysql://financeuser:financepass123@localhost:3306/finance_db"
   ```

### Benefits of This Approach

- **Direct Connection**: No Docker networking layer to troubleshoot
- **Native Performance**: MySQL runs directly on the WSL Ubuntu instance
- **Consistent Environment**: Same distro for both app and database
- **Simplified Debugging**: Standard Linux MySQL troubleshooting applies

### Managing the MySQL Service

```bash
# Start MySQL
sudo service mysql start

# Stop MySQL  
sudo service mysql stop

# Check status
sudo service mysql status

# Enable auto-start (optional)
sudo systemctl enable mysql
```

## Docker-Related Attempts (Historical)

Previous attempts to resolve the Docker networking issue included:

- Using container IP addresses (172.18.0.x) - resulted in timeouts
- Switching to localhost/127.0.0.1 connections - authentication failures
- Implementing host networking mode - still had connectivity issues
- Creating various MySQL users with different host permissions - no success

## Why Docker Desktop WSL2 Integration is Problematic

1. **Separate Network Stacks**: Each WSL distro has its own network interface
2. **Port Forwarding Issues**: Ports exposed in `docker-desktop` may not be accessible from other distros
3. **DNS Resolution**: Container names and localhost behave differently across distros
4. **Firewall Rules**: Windows and WSL2 firewalls can interfere with inter-distro communication

## Alternative Solutions (Not Currently Used)

### Option 1: Run Application in Docker
Move the entire development environment into Docker containers to ensure they're on the same network.

### Option 2: Use Windows Host Networking
Configure Docker Desktop to use Windows host networking instead of WSL2 networking.

### Option 3: Unified WSL Distro
Run both Docker and development tools in the same WSL distro (requires Docker CE installation in Ubuntu instead of Docker Desktop).

## Current Status

- ✅ **MySQL**: Running natively on Ubuntu-22.04 WSL instance
- ✅ **Database Connection**: Working reliably via localhost:3306
- ✅ **Development Workflow**: Functional with `pnpm db:push` and other database operations
- ⏳ **Docker Integration**: Remains an unresolved challenge

## Troubleshooting Tips

If you encounter issues with the native MySQL setup:

1. **Check MySQL Status**:
   ```bash
   sudo service mysql status
   ```

2. **Review MySQL Error Logs**:
   ```bash
   sudo tail -f /var/log/mysql/error.log
   ```

3. **Test Connection**:
   ```bash
   mysql -u financeuser -p -h localhost finance_db
   ```

4. **Verify Port Binding**:
   ```bash
   sudo netstat -tlnp | grep :3306
   # or
   ss -tlnp | grep :3306
   ```

## Future Considerations

This native MySQL approach is suitable for development but may need adjustment for:
- Production deployments (should use containerized MySQL)
- Team development (Docker Compose provides consistency)
- CI/CD pipelines (typically expect containerized services)

When Docker Desktop's WSL2 networking issues are resolved or when moving to a different development setup, we can revisit containerized MySQL deployment.