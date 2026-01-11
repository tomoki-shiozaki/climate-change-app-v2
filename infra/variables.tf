variable "project_id" {}
variable "region" {
  default = "asia-northeast1"
}
variable "service_name" {
  default = "climate-change-app-v2"
}

variable "secret_key" {}
variable "database_url" {}
variable "allowed_hosts" {}
variable "csrf_trusted_origins" {}
variable "cors_origin_whitelist" {}