#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"
HOST="${HOST:-127.0.0.1}"
TENANT_ID="${NEXT_PUBLIC_TENANT_ID:-tenant-demo}"
API_URL="${NEXT_PUBLIC_API_URL:-http://${HOST}:${BACKEND_PORT}}"

BACKEND_PID=""
FRONTEND_PID=""

is_port_busy() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti ":${port}" >/dev/null 2>&1
    return $?
  fi
  return 1
}

cleanup() {
  echo
  echo "Stopping Morocco ERP servers..."
  if [ -n "${FRONTEND_PID}" ] && kill -0 "${FRONTEND_PID}" >/dev/null 2>&1; then
    kill "${FRONTEND_PID}" >/dev/null 2>&1 || true
  fi
  if [ -n "${BACKEND_PID}" ] && kill -0 "${BACKEND_PID}" >/dev/null 2>&1; then
    kill "${BACKEND_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

cd "${ROOT_DIR}"

if is_port_busy "${BACKEND_PORT}"; then
  echo "Backend port ${BACKEND_PORT} is already in use."
  echo "Stop the existing process or run with BACKEND_PORT=3100 ./run-app.sh"
  exit 1
fi

if is_port_busy "${FRONTEND_PORT}"; then
  echo "Frontend port ${FRONTEND_PORT} is already in use."
  echo "Stop the existing process or run with FRONTEND_PORT=3002 ./run-app.sh"
  exit 1
fi

echo "Building backend..."
npm --prefix backend run build

echo "Starting backend API on http://${HOST}:${BACKEND_PORT}"
HOST="${HOST}" PORT="${BACKEND_PORT}" node backend/dist/main.js &
BACKEND_PID="$!"

echo "Starting frontend on http://${HOST}:${FRONTEND_PORT}"
(
  cd "${ROOT_DIR}/frontend"
  NEXT_PUBLIC_API_URL="${API_URL}" \
  NEXT_PUBLIC_TENANT_ID="${TENANT_ID}" \
  npm exec -- next dev --hostname "${HOST}" --port "${FRONTEND_PORT}"
) &
FRONTEND_PID="$!"

echo
echo "Morocco ERP is starting:"
echo "  Frontend: http://${HOST}:${FRONTEND_PORT}"
echo "  Backend:  http://${HOST}:${BACKEND_PORT}"
echo "  Tenant:   ${TENANT_ID}"
echo
echo "Press Ctrl+C to stop both servers."

while true; do
  if ! kill -0 "${BACKEND_PID}" >/dev/null 2>&1; then
    echo "Backend process stopped."
    exit 1
  fi
  if ! kill -0 "${FRONTEND_PID}" >/dev/null 2>&1; then
    echo "Frontend process stopped."
    exit 1
  fi
  sleep 1
done
