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

module "action_v2_create_user" {
  source = "./modules/action_v2_create_user"

  zitadel_domain   = var.zitadel_domain
  zitadel_port     = var.zitadel_port
  zitadel_insecure = var.zitadel_insecure

  depends_on = [module.action_flat_roles]
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
