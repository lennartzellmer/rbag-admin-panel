zitadel_domain   = "localhost"
zitadel_insecure = true
zitadel_port     = 8080

create_user_action_endpoint = "http://host.docker.internal:3001/api/create-user"

org_name             = "Hauptorganisation"
project_name         = "Anmeldesystem"
app_name             = "Webapp"
default_redirect_uri = "http://0.0.0.0:3001"

redirect_uris             = ["http://0.0.0.0:3001/api/auth/zitadel", "http://localhost:3001/api/auth/zitadel"]
post_logout_redirect_uris = ["http://0.0.0.0:3001", "https://localhost:3001"]

smtp_sender_address   = "sender@example.com"
smtp_sender_name      = "no-reply"
smtp_host             = "mailhog:1025"
smtp_tls              = false
smtp_reply_to_address = "replyto@example.com"
smtp_user             = " "
smtp_password         = " "
