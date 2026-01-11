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
}
