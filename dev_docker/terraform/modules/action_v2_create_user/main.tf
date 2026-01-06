terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

resource "zitadel_action_target" "create_user" {
  name               = "createUser"
  endpoint           = var.create_user_action_endpoint
  target_type        = "REST_WEBHOOK"
  interrupt_on_error = true
  timeout            = "10s"
}

resource "zitadel_action_execution_response" "create_user_response" {
  target_ids = [zitadel_action_target.create_user.id]
  method  = "/zitadel.user.v2.UserService/AddHumanUser"
  depends_on = [zitadel_action_target.create_user]
}

output "create_user_target_signing_key" {
  value     = zitadel_action_target.create_user.signing_key
  sensitive = true
}
