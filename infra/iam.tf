# プロジェクト情報を取得
data "google_project" "current" {}

# Cloud Buildサービスアカウントのメールアドレスを locals で組み立て
locals {
  cloudbuild_sa = "${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

# Artifact Registry push権限を付与
resource "google_project_iam_member" "cloudbuild_artifact_registry" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${local.cloudbuild_sa}"
}
