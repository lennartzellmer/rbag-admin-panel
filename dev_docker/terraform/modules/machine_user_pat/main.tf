terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

resource "zitadel_machine_user" "this" {
  org_id      = var.org_id
  user_name   = var.machine_user_name
  name        = var.machine_user_human_name
  description = "A backend user for the Anmeldesystem"
  with_secret = false
}

resource "zitadel_org_member" "user_manager" {
  org_id     = var.org_id
  user_id    = zitadel_machine_user.this.id
  roles      = ["ORG_USER_MANAGER"]
}

resource "zitadel_personal_access_token" "this" {
  org_id  = var.org_id
  user_id = zitadel_machine_user.this.id

  lifecycle {
    // keep initial PAT stable across subsequent applies
    ignore_changes  = [token]
  }
}

output "user_id" { value = zitadel_machine_user.this.id }
output "pat" {
  value     = zitadel_personal_access_token.this.token
  sensitive = true
}
