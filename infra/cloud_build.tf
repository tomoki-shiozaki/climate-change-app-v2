resource "google_cloudbuild_trigger" "app_trigger" {
  name     = "climate-change-app-v2-deploy"
  filename = "cloudbuild.yaml"

  github {
    owner = "tomoki-shiozaki"
    name  = "climate-change-app-v2"
    push {
      branch = "^main$"
    }
  }

  # GitHub Actions から渡す秘密情報を Terraform 変数経由で Substitution に渡す
  substitutions = {
    _SECRET_KEY   = var.secret_key
    _DATABASE_URL = var.database_url
    _ALLOWED_HOSTS = var.allowed_hosts
    _CSRF_TRUSTED_ORIGINS = var.csrf_trusted_origins
    _CORS_ORIGIN_WHITELIST = var.cors_origin_whitelist
  }
}
