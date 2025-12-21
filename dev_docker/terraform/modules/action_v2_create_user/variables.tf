variable "zitadel_domain" { type = string }
variable "zitadel_insecure" { type = bool }
variable "zitadel_port" { type = number }
variable "admin_pat_file" {
  type    = string
  default = "../zitadel/pat-admin.pat"
}

locals {
  admin_pat = trimspace(file("${path.root}/${var.admin_pat_file}"))
}
