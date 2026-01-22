import csv
import io

from django.db import transaction
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_naive, make_aware

from apps.dataset.models import DataPoint, Dataset

BATCH_SIZE = 1000


def parse_dataset_csv(dataset: Dataset) -> None:
    """
    Dataset.source_file の CSV を parse して DataPoint を作成する
    """

    # 冪等性 & 多重実行ガード
    if not dataset.mark_processing():
        return

    try:
        with dataset.source_file.open("rb") as f:
            text_file = io.TextIOWrapper(f, encoding="utf-8")
            reader = csv.DictReader(text_file)

            required_fields = {"time", "value"}
            if not required_fields.issubset(reader.fieldnames or []):
                raise ValueError("CSV に time,value 列がありません")

            schema = {
                "columns": reader.fieldnames,
                "row_count": 0,
                "row_index_base": 0,
            }

            buffer: list[DataPoint] = []
            total_rows = 0

            with transaction.atomic():
                for idx, row in enumerate(reader):
                    # --- time のパース ---
                    raw_time = row.get("time")
                    if not raw_time:
                        raise ValueError(f"time が空です (row={idx})")

                    dt = parse_datetime(raw_time)
                    if dt is None:
                        raise ValueError(
                            f"Invalid datetime format: {raw_time} (row={idx})"
                        )

                    if is_naive(dt):
                        dt = make_aware(dt)

                    # --- value のパース ---
                    try:
                        value = float(row["value"])
                    except (KeyError, ValueError):
                        raise ValueError(
                            f"Invalid value: {row.get('value')} (row={idx})"
                        )

                    buffer.append(
                        DataPoint(
                            dataset=dataset,
                            time=dt,
                            value=value,
                            series=row.get("series", "") or "",
                            row_index=idx,
                        )
                    )

                    # --- chunk insert ---
                    if len(buffer) >= BATCH_SIZE:
                        DataPoint.objects.bulk_create(buffer)
                        total_rows += len(buffer)
                        buffer.clear()

                # 残りを insert
                if buffer:
                    DataPoint.objects.bulk_create(buffer)
                    total_rows += len(buffer)

                schema["row_count"] = total_rows
                dataset.mark_parsed(schema=schema)

    except Exception as e:
        dataset.mark_failed(e)
        raise
