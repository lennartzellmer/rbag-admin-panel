#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_EXAMPLE="${ROOT_DIR}/.env.example"
ENV_FILE="${ROOT_DIR}/.env"
TF_DIR="${ROOT_DIR}/dev_docker/terraform"

if [[ ! -f "${ENV_FILE}" ]]; then
  cp "${ENV_EXAMPLE}" "${ENV_FILE}"
  echo "Created ${ENV_FILE} from ${ENV_EXAMPLE}."
else
  echo "Found existing ${ENV_FILE}; leaving it unchanged."
fi

docker-compose --env-file "${ENV_FILE}" -f "${ROOT_DIR}/dev_docker/docker-compose.yml" up -d

if [[ -f "${TF_DIR}/terraform.tfstate" || -f "${TF_DIR}/terraform.tfstate.backup" ]]; then
  rm -f "${TF_DIR}/terraform.tfstate" "${TF_DIR}/terraform.tfstate.backup"
  echo "Removed existing Terraform state files."
fi

(
  cd "${TF_DIR}"
  terraform init
  terraform apply
)

TF_OUTPUT_FILE="$(mktemp)"
(
  cd "${TF_DIR}"
  terraform output -json > "${TF_OUTPUT_FILE}"
)

python3 - "${ENV_FILE}" "${TF_OUTPUT_FILE}" <<'PY'
import json
import re
import sys
from pathlib import Path

env_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])
data = json.loads(output_path.read_text())

mapping = {
    "zitadel_client_id": "NUXT_OAUTH_ZITADEL_CLIENT_ID",
    "zitadel_org_id": "NUXT_ZITADEL_ORG_ID",
    "zitadel_project_id": "NUXT_ZITADEL_PROJECT_ID",
    "zitadel_backend_pat": "NUXT_ZITADEL_PERSONAL_ACCESS_TOKEN",
    "zitadel_create_user_target_signing_key": "NUXT_ZITADEL_CREATE_USER_ACTION_SIGNING_KEY",
}

values = {}
for tf_key, env_key in mapping.items():
    if tf_key in data and "value" in data[tf_key]:
        values[env_key] = str(data[tf_key]["value"])

lines = env_path.read_text().splitlines()
seen = set()
updated = []

for line in lines:
    match = re.match(r"^([A-Z0-9_]+)=", line)
    if match and match.group(1) in values:
        key = match.group(1)
        updated.append(f"{key}={values[key]}")
        seen.add(key)
    else:
        updated.append(line)

for key, value in values.items():
    if key not in seen:
        updated.append(f"{key}={value}")

env_path.write_text("\n".join(updated) + "\n")
print(f"Updated {env_path} with Zitadel outputs.")
PY

rm -f "${TF_OUTPUT_FILE}"
