from celery import shared_task  # type: ignore
from django.db import transaction

from apps.dataset.models import Dataset
from apps.dataset.services.csv_parser import parse_dataset_csv


@shared_task
def parse_dataset_task(dataset_id: int):
    dataset = Dataset.objects.get(id=dataset_id)
    try:
        dataset.status = Dataset.Status.PROCESSING
        dataset.save(update_fields=["status"])

        with transaction.atomic():
            parse_dataset_csv(dataset)

        dataset.status = Dataset.Status.PARSED
        dataset.save(update_fields=["status"])
    except Exception as e:
        dataset.status = Dataset.Status.FAILED
        dataset.save(update_fields=["status"])
        raise e
