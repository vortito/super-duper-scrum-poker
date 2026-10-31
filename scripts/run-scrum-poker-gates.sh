#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Gate 1/3: lint"
npm run lint

echo "==> Gate 2/3: build"
npm run build

echo "==> Gate 3/3: test"
npm run test

echo "All gates passed."
