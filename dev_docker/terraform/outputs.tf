output "zitadel_backend_pat" {
  value     = module.machine_user_pat.pat
  sensitive = true
}

output "zitadel_org_id" {
  value = module.org.org_id
}

output "zitadel_project_id" {
  value = module.project_oidc.project_id
}