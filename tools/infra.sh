#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <env: dev|staging|prod> <target: init|plan|apply|apply-auto> [-- <extra terraform args>]"
  exit 1
}

ENV_NAME="${1:-}"
ACTION="${2:-}"

if [[ -z "${ENV_NAME}" || -z "${ACTION}" ]]; then
  usage
fi

case "${ENV_NAME}" in
  dev|staging|prod) ;;
  *)
    echo "Error: invalid env '${ENV_NAME}'. Must be one of: dev, staging, prod" >&2
    usage
    ;;
esac

case "${ACTION}" in
  init|plan|apply|apply-auto) ;;
  *)
    echo "Error: invalid target '${ACTION}'. Must be one of: init, plan, apply, apply-auto" >&2
    usage
    ;;
esac

# Shift off env and action, leaving any extra args for terraform
shift 2 || true

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_DIR="${ROOT_DIR}/infra/environments/${ENV_NAME}"

if [[ ! -d "${ENV_DIR}" ]]; then
  echo "Error: environment directory not found: ${ENV_DIR}" >&2
  exit 1
fi

cd "${ENV_DIR}"

TFVARS_FILE="${ENV_DIR}/terraform.tfvars"
TFVARS_ARG=()
if [[ -f "${TFVARS_FILE}" ]]; then
  TFVARS_ARG=("-var-file=${TFVARS_FILE}")
fi

case "${ACTION}" in
  init)
    terraform init -upgrade "$@"
    ;;
  plan)
    terraform init -upgrade
    terraform fmt -recursive
    terraform validate
    terraform plan "${TFVARS_ARG[@]}" "$@"
    ;;
  apply)
    terraform init -upgrade
    terraform fmt -recursive
    terraform validate
    terraform apply "${TFVARS_ARG[@]}" "$@"
    ;;
  apply-auto)
    terraform init -upgrade
    terraform fmt -recursive
    terraform validate
    terraform apply -auto-approve "${TFVARS_ARG[@]}" "$@"
    ;;
esac


