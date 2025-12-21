terraform {
  required_providers {
    null = {
      source = "hashicorp/null"
    }
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

variable "zitadel_domain" { type = string }
variable "zitadel_insecure" { type = bool }
variable "zitadel_port" { type = number }
variable "admin_pat_file" {
  type    = string
  default = "../zitadel/pat-admin.pat"
  sensitive = true
}

locals {
  admin_pat = trimspace(file("${path.root}/${var.admin_pat_file}"))
}

resource "zitadel_action_target" "create_user" {
  name               = "createUser"
  endpoint           = "http://host.docker.internal:3001/api/create-user"
  target_type        = "REST_WEBHOOK"
  interrupt_on_error = false
  timeout            = "10s"
}

resource "null_resource" "action_execution" {
  triggers = {
    response_method = "/zitadel.user.v2.UserService/AddHumanUser"
    targets         = zitadel_action_target.create_user.id
  }

  provisioner "local-exec" {
    command = "npx --yes tsx ${path.module}/scripts/create_action_execution.ts"
    environment = {
      ZITADEL_DOMAIN                        = var.zitadel_domain
      ZITADEL_PORT                          = tostring(var.zitadel_port)
      ZITADEL_INSECURE                      = tostring(var.zitadel_insecure)
      ZITADEL_PAT                           = local.admin_pat
      ZITADEL_ACTION_EXECUTION_RESPONSE_METHOD = self.triggers.response_method
      ZITADEL_ACTION_EXECUTION_TARGET_IDS      = self.triggers.targets
    }
  }

  depends_on = [zitadel_action_target.create_user]
}

output "create_user_target_signing_key" {
  value     = zitadel_action_target.create_user.signing_key
  sensitive = true
}

output "create_user_target_id" {
  value = zitadel_action_target.create_user.id
}
