terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
    }
  }
}

resource "zitadel_action_target" "create_user" {
  name               = "createUser"
  endpoint           = "http://host.docker.internal:3001/api/create-user"
  target_type        = "REST_WEBHOOK"
  interrupt_on_error = false
  timeout            = "10s"
}

output "create_user_target_signing_key" {
  value     = zitadel_action_target.create_user.signing_key
  sensitive = true
}

output "create_user_target_id" {
  value = zitadel_action_target.create_user.id
}
