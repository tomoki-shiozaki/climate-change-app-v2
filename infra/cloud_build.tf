resource "google_cloudbuild_trigger" "app_trigger" {
  name     = "${var.service_name}-deploy"
  filename = "cloudbuild.yaml"

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  service_account = google_service_account.cloudbuild_runner.email
}