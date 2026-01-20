import csv

from apps.dataset.models import DataPoint, Dataset


def parse_dataset_csv(dataset: Dataset) -> None:
    """
    Dataset.source_file の CSV を parse して DataPoint を作成する
    """

    # 冪等性 & 多重実行ガード
    if not dataset.mark_processing():
        return

    try:
        with dataset.source_file.open("r") as f:
            reader = csv.DictReader(f)

            required_fields = {"time", "value"}
            if not required_fields.issubset(reader.fieldnames or []):
                raise ValueError("CSV に time,value 列がありません")

            schema = {
                "columns": reader.fieldnames,
                "row_count": 0,
            }

            data_points = []
            for idx, row in enumerate(reader):
                data_points.append(
                    DataPoint(
                        dataset=dataset,
                        time=row["time"],
                        value=float(row["value"]),
                        series=row.get("series", "") or "",
                        row_index=idx,
                    )
                )

            DataPoint.objects.bulk_create(data_points)
            schema["row_count"] = len(data_points)

            dataset.mark_parsed(schema=schema)

    except Exception as e:
        dataset.mark_failed(e)
        raise
