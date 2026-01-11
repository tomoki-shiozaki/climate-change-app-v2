resource "google_artifact_registry_repository" "climate_v2_repo" {
  repository_id = "climate-change-app-v2"
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repo for climate change app"
}
