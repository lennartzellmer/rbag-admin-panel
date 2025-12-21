terraform {
  required_providers {
    zitadel = {
      source = "zitadel/zitadel"
    }
  }
}

variable "sender_address" { type = string }
variable "sender_name" { type = string }
variable "tls" { type = bool }
variable "host" { type = string }
variable "reply_to_address" { type = string }
variable "user" { type = string }
variable "password" { type = string }

resource "zitadel_smtp_config" "this" {
  sender_address   = var.sender_address
  sender_name      = var.sender_name
  tls              = var.tls
  host             = var.host
  reply_to_address = var.reply_to_address
  user             = var.user
  password         = var.password
  set_active       = true
}
