#!/bin/sh
set -e

echo "▶  Running database seed..."
npx ts-node src/database/seeds/seed.ts

echo "▶  Starting CMS Service..."
exec node dist/main
