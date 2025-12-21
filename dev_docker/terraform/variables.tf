variable "zitadel_domain" { type = string }
variable "zitadel_insecure" {
  type    = bool
  default = true
}
variable "zitadel_port" {
  type    = number
  default = 8080
}
variable "zitadel_jwt_profile_file" { 
  type = string
  default = "../zitadel/key-service-user.json"
}

variable "org_name" {
  type    = string
  default = "Hauptorganisation"
}
variable "project_name" {
  type    = string
  default = "Anmeldesystem"
}
variable "app_name" {
  type    = string
  default = "Webapp"
}

variable "default_redirect_uri" {
  type    = string
  default = "http://localhost:3001"
}

variable "redirect_uris" {
  type = list(string)
}
variable "post_logout_redirect_uris" {
  type = list(string)
}

variable "machine_user_name" {
  type    = string
  default = "anmeldesystem-backend"
}
variable "machine_user_human_name" {
  type    = string
  default = "Anmeldesystem Backend"
}

# SMTP inputs
variable "smtp_sender_address" { type = string }
variable "smtp_sender_name" {
  type = string
}
variable "smtp_host" {
  type = string
}
variable "smtp_tls" {
  type    = bool
  default = false
}
variable "smtp_reply_to_address" {
  type = string
}
variable "smtp_user" {
  type    = string
  default = " "
}
variable "smtp_password" {
  type    = string
  default = " "
}
