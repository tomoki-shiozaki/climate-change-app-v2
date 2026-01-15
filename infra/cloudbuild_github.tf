############################################
# 既存の Cloud Build GitHub Connection を参照
############################################
data "google_cloudbuildv2_connection" "github" {
  name     = "github-connection-climate-v2"
  location = "asia-northeast1"
}

############################################
# Cloud Build GitHub Repository (v2)
############################################
resource "google_cloudbuildv2_repository" "repo" {
  location          = "global"
  name              = var.github_repo
  parent_connection = data.google_cloudbuildv2_connection.github.id
  remote_uri        = "https://github.com/${var.github_owner}/${var.github_repo}.git"
}