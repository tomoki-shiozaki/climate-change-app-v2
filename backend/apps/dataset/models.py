from django.conf import settings
from django.db import models


class Dataset(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="datasets",
    )
    name = models.CharField(max_length=255)

    source_file = models.FileField(
        upload_to="datasets/source/",
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("uploaded", "Uploaded"),
            ("parsed", "Parsed"),
            ("failed", "Failed"),
        ],
        default="uploaded",
    )

    created_at = models.DateTimeField(auto_now_add=True)
