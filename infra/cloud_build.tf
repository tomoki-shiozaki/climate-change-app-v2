resource "google_cloudbuild_trigger" "app_trigger" {
  name     = "climate-build-trigger"
  filename = "cloudbuild.yaml"

  github {
    owner = "YOUR_GITHUB_ORG"
    name  = "YOUR_REPO"
    push {
      branch = "^main$"
    }
  }
}
