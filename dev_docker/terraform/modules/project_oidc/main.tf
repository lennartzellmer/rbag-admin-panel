terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
    }
  }
}

resource "zitadel_project" "this" {
  name                   = var.project_name
  org_id                 = var.org_id
  project_role_assertion = true
  project_role_check     = false
  has_project_check      = false
}

resource "zitadel_application_oidc" "this" {
  project_id                = zitadel_project.this.id
  org_id                    = var.org_id
  name                      = var.app_name
  redirect_uris             = var.redirect_uris
  post_logout_redirect_uris = var.post_logout_redirect_uris

  response_types  = ["OIDC_RESPONSE_TYPE_CODE"]
  grant_types     = ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE", "OIDC_GRANT_TYPE_REFRESH_TOKEN"]
  app_type        = "OIDC_APP_TYPE_WEB"
  auth_method_type= "OIDC_AUTH_METHOD_TYPE_NONE"
  version         = "OIDC_VERSION_1_0"
  clock_skew      = "0s"
  dev_mode        = true

  access_token_type           = "OIDC_TOKEN_TYPE_BEARER"
  access_token_role_assertion = true
  id_token_role_assertion     = true
  id_token_userinfo_assertion = true
  additional_origins          = []
}

resource "zitadel_project_role" "this" {
  for_each     = { for r in var.roles : r.key => r }
  org_id       = var.org_id
  project_id   = zitadel_project.this.id
  role_key     = each.value.key
  display_name = each.value.display_name
  group        = each.value.group
}

output "project_id" { value = zitadel_project.this.id }
output "app_id"     { value = zitadel_application_oidc.this.id }
output "client_id"     { value = zitadel_application_oidc.this.client_id }