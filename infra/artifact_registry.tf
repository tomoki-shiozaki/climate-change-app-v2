resource "google_artifact_registry_repository" "climate_repo" {
  repository_id = "climate-change-app"
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repo for climate change app"
}
