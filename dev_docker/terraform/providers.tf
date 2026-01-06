terraform {
  required_version = "~> 1.5.0"

  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "~> 2.4.0"
    }
  }
}

provider "zitadel" {
  domain           = var.zitadel_domain
  insecure         = var.zitadel_insecure
  port             = var.zitadel_port
  jwt_profile_file = "${path.cwd}/${var.zitadel_jwt_profile_file}"
}
