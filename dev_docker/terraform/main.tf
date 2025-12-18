terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
    }
  }
}

provider "zitadel" {
  domain           = "localhost"
  insecure         = true
  port             = 8080
  jwt_profile_file = "${path.module}/../zitadel/key-service-user.json"
}

resource "zitadel_org" "default" {
  name = "Hauptorganisation"
}

resource "zitadel_project" "default" {
  name                   = "Anmeldesystem"
  org_id                 = zitadel_org.default.id
  project_role_assertion = true
  project_role_check     = false
  has_project_check      = false
}

resource "zitadel_application_oidc" "default" {
  project_id                  = zitadel_project.default.id
  org_id                      = zitadel_org.default.id
  name                        = "Webapp"
  redirect_uris               = ["http://localhost:3001/api/auth/zitadel"]
  response_types              = ["OIDC_RESPONSE_TYPE_CODE"]
  grant_types                 = ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE", "OIDC_GRANT_TYPE_REFRESH_TOKEN"]
  post_logout_redirect_uris   = ["https://localhost:3001"]
  app_type                    = "OIDC_APP_TYPE_WEB"
  auth_method_type            = "OIDC_AUTH_METHOD_TYPE_NONE"
  version                     = "OIDC_VERSION_1_0"
  clock_skew                  = "0s"
  dev_mode                    = true
  access_token_type           = "OIDC_TOKEN_TYPE_BEARER"
  access_token_role_assertion = true
  id_token_role_assertion     = true
  id_token_userinfo_assertion = true
  additional_origins          = []
}

resource "zitadel_project_role" "user" {
  org_id       = zitadel_org.default.id
  project_id   = zitadel_project.default.id
  role_key     = "user"
  display_name = "User"
  group        = "user"
}

resource "zitadel_project_role" "admin" {
  org_id       = zitadel_org.default.id
  project_id   = zitadel_project.default.id
  role_key     = "admin"
  display_name = "Admin"
  group        = "admin"
}

resource "zitadel_machine_user" "default" {
  org_id      = zitadel_org.default.id
  user_name   = "anmeldesystem-backend"
  name        = "Anmeldesystem Backend"
  description = "A backend user for the Anmeldesystem"
  with_secret = false
}

resource "zitadel_personal_access_token" "default" {
  org_id  = zitadel_org.default.id
  user_id = zitadel_machine_user.default.id
}

output "zitadel_backend_pat" {
  value     = zitadel_personal_access_token.default.token
  sensitive = true
}

resource "zitadel_action" "flat_roles" {
  org_id          = zitadel_org.default.id
  name            = "flatRoles"
  script          = <<-EOT
function flatRoles(ctx, api) {
  if (ctx.v1.user.grants == undefined || ctx.v1.user.grants.count == 0) {
    return;
  }

  const roleSet = new Set();
  ctx.v1.user.grants.grants.forEach(claim => {
    claim.roles.forEach(role => {
      roleSet.add(role);
    });
  });

  api.v1.claims.setClaim('roles', Array.from(roleSet));
}
function flatRoles(ctx, api) {
  if (ctx.v1.user.grants == undefined || ctx.v1.user.grants.count == 0) {
    return;
  }

  const roleSet = new Set();
  ctx.v1.user.grants.grants.forEach(claim => {
    claim.roles.forEach(role => {
      roleSet.add(role);
    });
  });

  api.v1.claims.setClaim('roles', Array.from(roleSet));
}
EOT
  timeout         = "10s"
  allowed_to_fail = false
}

resource "zitadel_trigger_actions" "flat_roles" {
  org_id       = zitadel_org.default.id
  flow_type    = "FLOW_TYPE_CUSTOMISE_TOKEN"
  trigger_type = "TRIGGER_TYPE_PRE_USERINFO_CREATION"
  action_ids   = [zitadel_action.flat_roles.id]
}

resource "zitadel_smtp_config" "default" {
  sender_address   = "sender@example.com"
  sender_name      = "no-reply"
  tls              = false
  host             = "mailhog:1025"
  reply_to_address = "replyto@example.com"
  user             = " "
  password         = " "
  set_active       = true
}
