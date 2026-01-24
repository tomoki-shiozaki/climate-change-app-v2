from django.conf import settings

from apps.dataset.tasks import parse_dataset_task

# 将来 Pub/Sub 用関数もここに import 可能


def enqueue_parse_dataset(dataset_id: int):
    """
    CSV パースタスクを実行／キューに投げる
    開発環境：Celery eager
    本番環境：Pub/Sub
    """
    backend = getattr(settings, "QUEUE_BACKEND", "celery")

    if backend == "celery":
        parse_dataset_task.delay(dataset_id)
    elif backend == "pubsub":
        # publish_parse_dataset(dataset_id)
        # Pub/Sub 実装は後でここに置く
        pass
