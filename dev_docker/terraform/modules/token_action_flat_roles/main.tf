terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
    }
  }
}

variable "org_id" { type = string }

resource "zitadel_action" "flat_roles" {
  org_id  = var.org_id
  name    = "flatRoles"
  script  = <<-EOT
function flatRoles(ctx, api) {
  if (ctx.v1.user.grants == undefined || ctx.v1.user.grants.count == 0) {
    return;
  }

  const roleSet = new Set();
  ctx.v1.user.grants.grants.forEach(claim => {
    claim.roles.forEach(role => {
      roleSet.add(role);
    });
  });

  api.v1.claims.setClaim('roles', Array.from(roleSet));
}
EOT
  timeout         = "10s"
  allowed_to_fail = false
}

resource "zitadel_trigger_actions" "flat_roles" {
  org_id       = var.org_id
  flow_type    = "FLOW_TYPE_CUSTOMISE_TOKEN"
  trigger_type = "TRIGGER_TYPE_PRE_USERINFO_CREATION"
  action_ids   = [zitadel_action.flat_roles.id]
}

resource "zitadel_action_target" "create_user" {
  name = "createUser"
  endpoint = "http://host.docker.internal:3001/api/create-user"
  target_type = "REST_WEBHOOK"
  interrupt_on_error = false
  timeout = "10s"
}

output "create_user_target_signing_key" {
  value = zitadel_action_target.create_user.signing_key
}

output "create_user_target_id" {
  value = zitadel_action_target.create_user.id
}
