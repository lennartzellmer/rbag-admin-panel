output "zitadel_org_id" {
  value = module.org.org_id
}

output "zitadel_backend_pat" {
  value     = module.machine_user_pat.pat
  sensitive = true
}

output "zitadel_client_id" {
  value = module.project_oidc.client_id
  sensitive = true
}

output "zitadel_project_id" {
  value = module.project_oidc.project_id
}

output "zitadel_create_user_target_signing_key" {
  value = module.token_action_flat_roles.create_user_target_signing_key
  sensitive = true
}

output "zitadel_create_user_target_id" {
  value = module.token_action_flat_roles.create_user_target_id
}
