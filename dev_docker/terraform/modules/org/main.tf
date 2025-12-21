terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

variable "org_name" { type = string }

resource "zitadel_org" "this" {
  name = var.org_name
}

resource "zitadel_default_login_policy" "this" {
  allow_register                = true
  allow_external_idp            = false
  default_redirect_uri          = "http://localhost:3001"
  force_mfa                     = false
  force_mfa_local_only          = false
  hide_password_reset           = false
  ignore_unknown_usernames      = false
  password_check_lifetime       = "240h0m0s"
  external_login_check_lifetime = "240h0m0s"
  multi_factor_check_lifetime   = "24h0m0s"
  mfa_init_skip_lifetime        = "720h0m0s"
  second_factor_check_lifetime  = "24h0m0s"
  passwordless_type             = "PASSWORDLESS_TYPE_ALLOWED"
  user_login                    = true
}

output "org_id" {
  value = zitadel_org.this.id
}
