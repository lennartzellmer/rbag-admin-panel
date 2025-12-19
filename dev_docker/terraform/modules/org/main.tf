terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.3.0"
    }
  }
}

variable "org_name" { type = string }

resource "zitadel_org" "this" {
  name = var.org_name
}

output "org_id" {
  value = zitadel_org.this.id
}