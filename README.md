![example workflow](https://github.com/byte-crafters/nimbus/actions/workflows/github-actions-demo.yml/badge.svg)
# Nimbus - new generation of data cloud storage  
Commit naming convention - [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
# How to run it?
## Prerequisites
- `make` installed
- `docker` installed
```bash
# Install all dependencies
make dependencies
# Start all services for local development
make nimbus
```
Note: before running `make nimbus` make sure you have environment variable `NIMBUS_DEV_ENV_OS` exported. Only values `win`, `linux` make sense.