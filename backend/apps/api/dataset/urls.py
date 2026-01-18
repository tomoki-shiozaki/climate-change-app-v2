from django.urls import path

from apps.api.dataset.views import DatasetUploadAPIView

app_name = "dataset"

urlpatterns = [
    path("upload/", DatasetUploadAPIView.as_view(), name="upload"),
]
