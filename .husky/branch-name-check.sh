#!/bin/sh
set -e

# Get current branch name
branch_name=$(git symbolic-ref --short HEAD)

# Only enforce for feature/* or fix/*
if echo "$branch_name" | grep -E '^(feature|fix|hotfix)/' > /dev/null; then
  # Enforce ticket prefix: uppercase letters + dash + number + dash
  if ! echo "$branch_name" | grep -E '^(feature|fix)/[A-Z]+-[0-9]+-' > /dev/null; then
    echo "Error: Branch '$branch_name' must include a ticket number in the format ABC-123-<description>."
    echo "Example: feature/ABC-6-weekly-view"
    exit 1
  fi
fi