resource "google_cloudbuild_trigger" "app_trigger" {
  name     = "${var.service_name}-deploy"
  location = "global"

  repository_event_config {
    repository = google_cloudbuildv2_repository.repo.id

    push {
      branch = "^main$"
    }
  }

  filename        = "cloudbuild.yaml"
  service_account = google_service_account.cloudbuild_runner.email
}
