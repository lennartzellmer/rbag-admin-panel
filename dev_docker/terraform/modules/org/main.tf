terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

resource "zitadel_org" "this" {
  name = var.org_name
  is_default = true
}

resource "zitadel_default_login_policy" "this" {
  allow_register                = true
  allow_external_idp            = false
  default_redirect_uri          = var.default_redirect_uri
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

resource "zitadel_default_password_complexity_policy" "default" {
  min_length    = "8"
  has_uppercase = false
  has_lowercase = false
  has_number    = false
  has_symbol    = false
}

resource "zitadel_password_complexity_policy" "default" {
  org_id        = zitadel_org.this.id
  min_length    = "1"
  has_uppercase = false
  has_lowercase = false
  has_number    = false
  has_symbol    = false
}

resource "zitadel_default_label_policy" "this" {
  background_color       = "#f1efee"
  primary_color          = "#9f1b68"
  warn_color             = "#cd3d56"
  font_color             = "#1f071d"
  background_color_dark  = "#15110F"
  primary_color_dark     = "#b81d74"
  warn_color_dark        = "#ff3b5b"
  font_color_dark        = "#e8e4e3"
  hide_login_name_suffix = true
  disable_watermark      = true
  set_active             = true
}

output "org_id" {
  value = zitadel_org.this.id
}
