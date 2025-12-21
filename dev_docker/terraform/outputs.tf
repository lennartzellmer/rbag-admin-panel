output "zitadel_client_id" {
  value = module.project_oidc.client_id
  sensitive = true
  description = "NUXT_OAUTH_ZITADEL_CLIENT_ID"
}

output "zitadel_org_id" {
  value = module.org.org_id
  description = "Put in .env at NUXT_ZITADEL_ORG_ID"
}

output "zitadel_project_id" {
  value = module.project_oidc.project_id
  description = "Put in .env at NUXT_ZITADEL_PROJECT_ID"
}

output "zitadel_backend_pat" {
  value     = module.machine_user_pat.pat
  sensitive = true
  description = "Put in .env at NUXT_ZITADEL_PERSONAL_ACCESS_TOKEN"
}

output "zitadel_create_user_target_signing_key" {
  value     = module.action_v2_create_user.create_user_target_signing_key
  sensitive = true
  description = "Put in .env at NUXT_ZITADEL_CREATE_USER_TARGET_SIGNING_KEY"
}
