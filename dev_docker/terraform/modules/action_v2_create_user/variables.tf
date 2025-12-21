variable "zitadel_domain" { type = string }
variable "zitadel_insecure" { type = bool }
variable "zitadel_port" { type = number }
variable "create_user_action_endpoint" {
  type    = string
  default = "http://host.docker.internal:3001/api/create-user"
}
variable "admin_pat_file" {
  type    = string
  default = "../zitadel/pat-admin.pat"
  sensitive = true
}

locals {
  admin_pat = trimspace(file("${path.root}/${var.admin_pat_file}"))
}
