module "org" {
  source   = "./modules/org"
  org_name = var.org_name
}

module "project_oidc" {
  source        = "./modules/project_oidc"
  org_id        = module.org.org_id
  project_name  = var.project_name
  app_name      = var.app_name
  redirect_uris = var.redirect_uris
  post_logout_redirect_uris = var.post_logout_redirect_uris

  roles = [
    { key = "user",  display_name = "User",  group = "user"  },
    { key = "admin", display_name = "Admin", group = "admin" },
  ]
}

module "machine_user_pat" {
  source           = "./modules/machine_user_pat"
  org_id           = module.org.org_id
  project_id       = module.project_oidc.project_id
  machine_user_name       = var.machine_user_name
  machine_user_human_name = var.machine_user_human_name
}

module "action_flat_roles" {
  source = "./modules/action_flat_roles"
  org_id = module.org.org_id
}

module "create_user_action_target" {
  source = "./modules/create_user_action_target"
}

module "smtp" {
  source           = "./modules/smtp"
  sender_address   = var.smtp_sender_address
  sender_name      = var.smtp_sender_name
  host             = var.smtp_host
  tls              = var.smtp_tls
  reply_to_address = var.smtp_reply_to_address
  user             = var.smtp_user
  password         = var.smtp_password
}

resource "null_resource" "action_execution" {
  triggers = {
    response_method = "/zitadel.user.v2.UserService/AddHumanUser"
    targets         = module.create_user_action_target.create_user_target_id
  }

  provisioner "local-exec" {
    command = "npx --yes tsx ${path.module}/scripts/create_action_execution.ts"
    environment = {
      ZITADEL_DOMAIN                        = var.zitadel_domain
      ZITADEL_PORT                          = tostring(var.zitadel_port)
      ZITADEL_INSECURE                      = tostring(var.zitadel_insecure)
      ZITADEL_PAT                           = trimspace(file("${path.module}/../zitadel/pat-admin.pat"))
      ZITADEL_ACTION_EXECUTION_RESPONSE_METHOD = self.triggers.response_method
      ZITADEL_ACTION_EXECUTION_TARGET_IDS      = self.triggers.targets
    }
  }

  depends_on = [
    module.action_flat_roles,
    module.create_user_action_target,
  ]
}
