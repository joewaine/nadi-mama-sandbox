#!/bin/bash
# Nadi Mama - Sandbox Startup Script
# Starts local MongoDB, seeds the database, and runs both backend and frontend

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/cleanedupbackend-main"
FRONTEND_DIR="$SCRIPT_DIR/nadiNuxt"

echo "========================================"
echo "  NADI MAMA - SANDBOX MODE"
echo "========================================"
echo ""

# Check for MongoDB
if ! command -v mongod &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo "MongoDB not found. Install it with:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo ""
    echo "Or use Docker:"
    echo "  docker run -d -p 27017:27017 --name nadi-mongo mongo:6"
    echo ""
    exit 1
fi

# Check if MongoDB is running
if ! mongosh --eval "db.runCommand({ping:1})" --quiet 2>/dev/null && \
   ! mongo --eval "db.runCommand({ping:1})" --quiet 2>/dev/null; then
    echo "Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null || true
    fi
    sleep 2
fi

echo "MongoDB is running"

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --silent 2>/dev/null

# Add uuid package needed by mock emergepay
npm install uuid --save --silent 2>/dev/null

# Seed the database
echo ""
echo "Seeding database..."
node sandbox/seed.js

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --silent 2>/dev/null

# Start both servers
echo ""
echo "========================================"
echo "  Starting servers..."
echo "========================================"
echo ""
echo "  Backend:  http://localhost:4000"
echo "  Frontend: http://localhost:3000"
echo "  Sandbox Debug: http://localhost:4000/sandbox/status"
echo "  View Emails: http://localhost:4000/sandbox/emails"
echo "  View SMS: http://localhost:4000/sandbox/sms"
echo ""
echo "  Demo login: demo@example.com / password123"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo "========================================"
echo ""

# Start backend in background
cd "$BACKEND_DIR"
SANDBOX_MODE=true node index.js &
BACKEND_PID=$!

# Start frontend
cd "$FRONTEND_DIR"
API_URL=http://localhost:4000 npx nuxt dev &
FRONTEND_PID=$!

# Cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for either to exit
wait
