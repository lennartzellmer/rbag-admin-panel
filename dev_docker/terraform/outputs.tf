output "zitadel_backend_pat" {
  value     = module.machine_user_pat.pat
  sensitive = true
}