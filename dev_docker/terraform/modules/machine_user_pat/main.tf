terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
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

resource "zitadel_project_member" "owner" {
  org_id     = var.org_id
  project_id = var.project_id
  user_id    = zitadel_machine_user.this.id
  roles      = ["PROJECT_OWNER"]
}

resource "zitadel_personal_access_token" "this" {
  org_id  = var.org_id
  user_id = zitadel_machine_user.this.id
}

output "user_id" { value = zitadel_machine_user.this.id }
output "pat" {
  value     = zitadel_personal_access_token.this.token
  sensitive = true
}