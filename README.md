![example workflow](https://github.com/byte-crafters/nimbus/actions/workflows/github-actions-demo.yml/badge.svg)
# Nimbus - new generation of data cloud storage  
Commit naming convention - [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
# How to run it?
## Prerequisites
- `make` installed
- `docker` installed
```bash
# Install all dependencies
make update
# Start all services for local development
make nimbus
```
Note: before running `make nimbus` make sure you have environment variable `NIMBUS_DEV_ENV_OS` exported. Only values `win`, `linux` make sense.
  
### Example: Linux
To run services on Linux:
```bash
make nimbus
# Start backend locally
make be
# Start frontend locally
make fe	
```

### Example: Windows
To run services on Windows
```bash
set NIMBUS_DEV_ENV_OS="win" && make nimbus
make be
make fe
```