terraform {
  required_version = "~> 1.6.0"

  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.0"
    }
    zitadel = {
      source  = "zitadel/zitadel"
      version = "~> 2.3.0"
    }
  }
}

provider "zitadel" {
  domain           = var.zitadel_domain
  insecure         = var.zitadel_insecure
  port             = var.zitadel_port
  jwt_profile_file = "${path.cwd}/${var.zitadel_jwt_profile_file}"
}
