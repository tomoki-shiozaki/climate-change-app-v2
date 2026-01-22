import csv
import io

from django.db import transaction
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_naive, make_aware

from apps.dataset.models import DataPoint, Dataset

BATCH_SIZE = 1000


# -----------------------------
# 1️⃣ 時刻パース関数
# -----------------------------
def parse_row_time(raw_time: str, row_idx: int):
    if not raw_time:
        raise ValueError(f"time が空です (row={row_idx})")
    dt = parse_datetime(raw_time)
    if dt is None:
        raise ValueError(f"Invalid datetime format: {raw_time} (row={row_idx})")
    if is_naive(dt):
        dt = make_aware(dt)
    return dt


# -----------------------------
# 2️⃣ 値パース関数
# -----------------------------
def parse_row_value(value_str: str, row_idx: int):
    try:
        return float(value_str)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid value: {value_str} (row={row_idx})")


# -----------------------------
# 3️⃣ DataPoint 作成関数
# -----------------------------
def create_datapoint(dataset: Dataset, row: dict, idx: int) -> DataPoint:
    dt = parse_row_time(row.get("time") or "", idx)
    value = parse_row_value(row.get("value") or "", idx)
    series = row.get("series", "") or ""
    return DataPoint(
        dataset=dataset, time=dt, value=value, series=series, row_index=idx
    )


# -----------------------------
# 4️⃣ メイン CSV パース関数
# -----------------------------
def parse_dataset_csv(dataset: Dataset) -> None:
    """
    Dataset.source_file の CSV を parse して DataPoint を作成する
    """

    # 冪等性 & 多重実行ガード
    if not dataset.mark_processing():
        return

    try:
        with dataset.source_file.open("rb") as f:
            # バイナリファイルをテキストとして読み込み、CSVを辞書形式で扱えるようにする
            text_file = io.TextIOWrapper(f, encoding="utf-8")
            reader = csv.DictReader(text_file)

            required_fields = {"time", "value"}
            if not required_fields.issubset(reader.fieldnames or []):
                raise ValueError("CSV に time,value 列がありません")

            schema = {
                # CSV の列名（ヘッダ行）を保存しておく
                "columns": reader.fieldnames,
                "row_count": 0,
                "row_index_base": 0,
            }

            buffer: list[DataPoint] = []
            total_rows = 0

            with transaction.atomic():
                for idx, row in enumerate(reader):
                    dp = create_datapoint(dataset, row, idx)
                    buffer.append(dp)

                    # chunk insert
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
