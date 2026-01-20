from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Dataset(models.Model):
    class Status(models.TextChoices):
        UPLOADED = "uploaded", _("アップロード済み")
        PROCESSING = "processing", _("処理中")
        PARSED = "parsed", _("解析完了")
        FAILED = "failed", _("失敗")

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
        choices=Status.choices,
        default=Status.UPLOADED,
    )

    schema = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)


class DataPoint(models.Model):
    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
        related_name="data_points",
    )
    time = models.CharField(max_length=50)
    value = models.FloatField()
    series = models.CharField(max_length=255, blank=True)
    row_index = models.IntegerField()

    class Meta:
        indexes = [
            models.Index(fields=["dataset", "time"]),
        ]
