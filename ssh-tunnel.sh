#!/bin/bash

# SSH Tunnel for PostgreSQL Database
# This creates a secure tunnel from localhost:5433 to remote PostgreSQL server
# Usage: ./ssh-tunnel.sh

# Configuration
SSH_USER="ikodioxlapo"
SSH_HOST="192.168.1.11"
SSH_PORT="7420"
LOCAL_PORT="5433"
REMOTE_HOST="localhost"
REMOTE_PORT="5432"

echo "🔐 Starting SSH Tunnel to PostgreSQL..."
echo "📍 Remote: ${SSH_USER}@${SSH_HOST}:${SSH_PORT} -> PostgreSQL:${REMOTE_PORT}"
echo "🏠 Local:  localhost:${LOCAL_PORT}"
echo ""
echo "⚠️  Keep this terminal open while developing"
echo "⚠️  Press Ctrl+C to stop the tunnel"
echo ""

# Create SSH tunnel
# -L: Local port forwarding
# -N: Don't execute remote command (just forward)
# -p: SSH port
ssh -p ${SSH_PORT} \
    -L ${LOCAL_PORT}:${REMOTE_HOST}:${REMOTE_PORT} \
    -N \
    ${SSH_USER}@${SSH_HOST}
