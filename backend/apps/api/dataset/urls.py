from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from apps.api.dataset.views import DatasetUploadAPIView

app_name = "dataset"

urlpatterns = [
    path("", DatasetUploadAPIView.as_view(), name="upload"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
