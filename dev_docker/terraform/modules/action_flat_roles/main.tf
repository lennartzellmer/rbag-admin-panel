terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
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
