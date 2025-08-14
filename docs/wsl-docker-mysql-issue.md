# MySQL Container Connection Issue (WSL/Docker)

## Problem

When running a MySQL container with Docker and attempting to connect from the host (or WSL), the application could not connect to the database. The error appeared when running `pnpm db:push` to test the API-to-DB connection.

## Investigation Steps

1. **Checked MySQL container status**: Confirmed the container was running and healthy.
2. **Inspected container logs**: No errors found; MySQL started successfully.
3. **Tested DB access inside the container**: Database was accessible from within the container.
4. **Checked port mapping**: Port 3306 was mapped from container to host.
5. **Reviewed connection string**: Initially used the container IP (`172.18.0.2:3306`), which caused timeouts.
6. **Tried connecting via localhost/127.0.0.1**: Encountered authentication errors for `root@localhost`.
7. **Checked MySQL users and permissions**: Verified users and privileges, created new users for external connections.
8. **Tested direct MySQL connections**: Connections from the host failed, but worked from within the container or with host networking.
9. **Reviewed Docker network configuration**: Confirmed container was on a bridge network; tried host networking.
10. **Updated docker-compose.yml**: Switched to `network_mode: host` for the MySQL service.

## Current Status

We have not arrived at a solution yet, but it seems to be a networking issue when running Docker Desktop on Windows with the WSL2 engine.

- **Update Docker Compose**: Set `network_mode: host` for the MySQL container in `docker-compose.yml`.
- **Update Connection String**: Use `mysql://root:123Root123@127.0.0.1:3306/finance_db` in your `.env` file.
- **Restart the Container**: Recreate the container with the new network settings.

## Final Status (Previous Attempts)

- MySQL container is running with host networking.
- Database is accessible from the host at `127.0.0.1:3306`.
- If authentication issues persist, reset the MySQL root password with native authentication:

  ```sh
  docker exec mysql-container mysql -u root -p123Root123 -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123Root123'; FLUSH PRIVILEGES;"
  ```

- Alternatively, run your application inside a container on the same Docker network as MySQL.

## Summary

- The root cause appears to be related to MySQL's authentication configuration and Docker's network isolation, especially when using Docker Desktop with WSL2.
- Using host networking and the correct connection string did not fully resolve the issue in this environment.
- If you encounter similar issues, check user permissions, authentication methods, and network settings, and consider WSL2/Docker Desktop networking limitations.
