#!/usr/bin/env bash
# Copies every filled-in EXPO_PUBLIC_* value from .env to EAS (production),
# so cloud builds get the same settings as this Mac. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."

while IFS='=' read -r name value; do
  [[ "$name" == EXPO_PUBLIC_* && -n "$value" ]] || continue
  echo "→ $name"
  npx eas-cli env:create --name "$name" --value "$value" \
    --visibility plaintext --environment production --force --non-interactive < /dev/null
done < .env

echo "Done. EAS now has your app settings for production builds."
