zitadel_domain           = "localhost"
zitadel_insecure         = true
zitadel_port             = 8080

org_name     = "Hauptorganisation"
project_name = "Anmeldesystem"
app_name     = "Webapp"
default_redirect_uri = "http://localhost:3001"

redirect_uris = ["http://localhost:3001/api/auth/zitadel"]
post_logout_redirect_uris = ["https://localhost:3001"]

smtp_sender_address   = "sender@example.com"
smtp_sender_name      = "no-reply"
smtp_host             = "mailhog:1025"
smtp_tls              = false
smtp_reply_to_address = "replyto@example.com"
smtp_user             = " "
smtp_password         = " "
