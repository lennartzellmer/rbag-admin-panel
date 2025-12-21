variable "org_id" { type = string }
variable "project_name" { type = string }
variable "app_name" { type = string }
variable "redirect_uris" { type = list(string) }
variable "post_logout_redirect_uris" { type = list(string) }

variable "roles" {
  type = list(object({
    key          = string
    display_name = string
    group        = string
  }))
  default = []
}