############################################
# Cloud Build GitHub Connection (v2)
############################################
resource "google_cloudbuildv2_connection" "github" {
  location = "asia-northeast1"
  name     = "github-connection-climate-v2"

  github_config {
    app_installation_id = var.github_app_installation_id
  }
}

############################################
# Cloud Build GitHub Repository (v2)
############################################
resource "google_cloudbuildv2_repository" "repo" {
  location           = "global"
  name               = var.github_repo
  parent_connection  = google_cloudbuildv2_connection.github.id
  remote_uri         = "https://github.com/${var.github_owner}/${var.github_repo}.git"
}
